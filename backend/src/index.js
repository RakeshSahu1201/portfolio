require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { connectDB, disconnectDB } = require('./config/database');
const { initializeDatabase } = require('./config/schema');
const { initRedisClient, getCached, setCached, deleteCached, invalidatePattern } = require('./config/redis');
const { initEmailService } = require('./config/email');
const { syncPortfolioBootstrapData, portfolioDataPath } = require('./utils/portfolioBootstrap');

// Import factory functions
const { createAuthRoutes } = require('./routes/auth');
const { createProjectRoutes } = require('./routes/projects');
const { createExperienceRoutes } = require('./routes/experience');
const { createAboutRoutes } = require('./routes/about');
const { createContactRoutes } = require('./routes/contact');

const { createAuthMiddleware } = require('./middleware/auth');
const { createValidationMiddleware } = require('./middleware/validate');

const { createAuthController } = require('./controllers/AuthController');
const { createProjectController } = require('./controllers/ProjectController');
const { createExperienceController } = require('./controllers/ExperienceController');
const { createAboutController } = require('./controllers/AboutController');
const { createContactController } = require('./controllers/ContactController');

const { createAuthService } = require('./services/AuthService');
const { createProjectService } = require('./services/ProjectService');
const { createExperienceService } = require('./services/ExperienceService');
const { createAboutService } = require('./services/AboutService');
const { createContactService } = require('./services/ContactService');

const {
  loginSchema,
  contactSchema,
  projectSchema,
  experienceSchema,
  aboutSchema,
} = require('./utils/validation');

// Pure function to create Express app with all middleware
const createApp = (dependencies) => {
  const app = express();
  app.set('trust proxy', 1);

  // Lightweight health probe for uptime checks and cron bots.
  app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }));

  // Compression middleware
  app.use(compression());

  // Parsing middleware
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  // Rate limiting middleware
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  });

  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: 'Too many contact submissions, please try again later.',
  });

  app.use(globalLimiter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  return {
    app,
    contactLimiter,
    globalLimiter,
  };
};

// Pure function to setup routes with dependency injection
const setupRoutes = (app, dependencies) => {
  const {
    authController,
    projectController,
    experienceController,
    aboutController,
    contactController,
    authMiddleware,
    contactLimiter,
  } = dependencies;

  const loginValidation = createValidationMiddleware(loginSchema);
  const projectValidation = createValidationMiddleware(projectSchema);
  const experienceValidation = createValidationMiddleware(experienceSchema);
  const aboutValidation = createValidationMiddleware(aboutSchema);
  const contactValidation = createValidationMiddleware(contactSchema);

  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/projects', createProjectRoutes(
    projectController,
    authMiddleware,
    projectValidation
  ));
  app.use('/api/experience', createExperienceRoutes(
    experienceController,
    authMiddleware,
    experienceValidation
  ));
  app.use('/api/about', createAboutRoutes(
    aboutController,
    authMiddleware,
    aboutValidation
  ));
  app.use('/api/contact', contactLimiter, createContactRoutes(
    contactController,
    contactValidation,
    authMiddleware
  ));

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });
};

// Pure function to initialize cache operations
const initializeCacheOps = (redisClient) => {
  return {
    get: getCached(redisClient),
    set: setCached(redisClient),
    delete: deleteCached(redisClient),
    invalidate: invalidatePattern(redisClient),
  };
};

// Main bootstrap function
const startServer = async () => {
  let db;
  try {
    // Initialize NeonDB connection
    db = await connectDB();

    // Initialize database schema
    await initializeDatabase(db);

    // Sync startup data from JSON source of truth
    const bootstrapCounts = await syncPortfolioBootstrapData(db);
    console.log(`✅ Portfolio data synced from ${portfolioDataPath}`);
    console.log(`   Projects: ${bootstrapCounts.projects}, Experience: ${bootstrapCounts.experience}`);

    // Initialize Redis
    const redisClient = await initRedisClient();
    const cacheOps = initializeCacheOps(redisClient);

    // Initialize Email Service
    await initEmailService();

    // Create Express app
    const { app, contactLimiter } = createApp();

    // Create authentication middleware
    const authMiddleware = createAuthMiddleware();

    // Create services with dependency injection
    const authService = createAuthService();
    const projectService = createProjectService(db, cacheOps);
    const experienceService = createExperienceService(db, cacheOps);
    const aboutService = createAboutService(db, cacheOps);
    const contactService = createContactService(db, cacheOps);

    // Create controllers with dependency injection
    const authController = createAuthController(authService);
    const projectController = createProjectController(projectService);
    const experienceController = createExperienceController(experienceService);
    const aboutController = createAboutController(aboutService);
    const contactController = createContactController(contactService);

    // Setup routes with all dependencies
    setupRoutes(app, {
      authController,
      projectController,
      experienceController,
      aboutController,
      contactController,
      authMiddleware,
      contactLimiter,
    });

    // Start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: NeonDB (PostgreSQL)`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      if (redisClient) await redisClient.quit();
      if (db) await disconnectDB(db);
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    if (db) await disconnectDB(db);
    process.exit(1);
  }
};

// Start the server
startServer();
