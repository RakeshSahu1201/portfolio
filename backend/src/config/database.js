const knex = require('knex');

// Pure function to establish database connection with NeonDB
const connectDB = async () => {
  try {
    const db = knex({
      client: 'pg',
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      },
      pool: { min: 2, max: 10 },
      acquireConnectionTimeout: 10000,
    });

    // Test connection with timeout
    const testConnection = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Connection test timeout')), 10000);
      db.raw('SELECT 1').then(() => {
        clearTimeout(timeout);
        resolve(true);
      }).catch(err => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    await testConnection;
    console.log('✅ NeonDB (PostgreSQL) connected');
    return db;
  } catch (error) {
    console.error('❌ NeonDB connection failed:', error.message);
    process.exit(1);
  }
};

// Functional disconnect utility
const disconnectDB = async (db) => {
  try {
    if (db) await db.destroy();
    console.log('✅ NeonDB disconnected');
  } catch (error) {
    console.error('❌ Disconnect failed:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
