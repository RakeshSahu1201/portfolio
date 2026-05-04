require('dotenv').config();
const bcryptjs = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/database');
const { initializeDatabase } = require('../config/schema');
const {
  portfolioDataPath,
  readPortfolioBootstrapFile,
  syncPortfolioBootstrapData,
} = require('../utils/portfolioBootstrap');

// Pure function to hash admin password
const hashPassword = async (password) => bcryptjs.hash(password, 10);

// Pure function to seed database
const seedDatabase = async () => {
  let db;
  try {
    db = await connectDB();

    // Initialize schema
    await initializeDatabase(db);

    const source = await readPortfolioBootstrapFile();
    const counts = await syncPortfolioBootstrapData(db);
    console.log(`✅ Loaded portfolio source from ${portfolioDataPath}`);
    console.log(`✅ Seeded ${counts.projects} projects`);
    console.log(`✅ Seeded ${counts.experience} experience entries`);
    console.log(`✅ Seeded about profile for ${source.about?.name || 'portfolio owner'}`);

    // Hash and store admin password
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
    console.log(`✅ Admin password hash: ${hashedPassword}`);
    console.log('⚠️  Update ADMIN_PASSWORD in .env with this hash');

    console.log('\n🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (db) await disconnectDB(db);
  }
};

// Execute seed
seedDatabase();
