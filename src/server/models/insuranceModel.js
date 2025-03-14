require('dotenv').config();
const { Pool } = require('pg');
// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'angular_insurance',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

async function getAllInsuranceData() {
    const result = await pool.query('SELECT * FROM insurance.insurance');
    return result.rows;
}

module.exports = {
    getAllInsuranceData
};
