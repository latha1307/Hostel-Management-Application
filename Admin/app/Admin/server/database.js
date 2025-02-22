const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
  },
  driver: process.env.DB_DRIVER,
  pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
  }
};

async function openPool() {
    try {
        const pool = await sql.connect(config);
        console.log('Database connected!');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

module.exports = { openPool };
