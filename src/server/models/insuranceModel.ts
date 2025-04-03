import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from .env file
dotenv.config();

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env['DB_USER'] as string,
  host: "localhost",
  database: "insurance",
  password: process.env['DB_PASSWORD'] as string,
});

// Define interfaces for the data returned from the queries
interface InsuranceData {
  id: number;
  age: number;
  sex: string;
  bmi: number;
  region: string;
  // Add more fields here based on your table schema
}

interface AgeGroupData {
  age_group: string;
  customers: number;
}

interface SexData {
  sex: string;
  count: number;
}

interface BMIGroupData {
  bmi_group: string;
  customers: number;
}

interface AgeBMIData {
  age: number;
  bmi: number;
}

interface AvgBmiData {
  average_bmi: number;
  region: string;
}

interface insurancePremiumData {
  premium: number;
}

interface insuranceInvestmentData {
  investment: number;
}

interface insuranceContractLSData {
  contractLS: number;
}

interface profitData {
  profit: number;
}
interface SankeyData {
  insurance_premiums: number;
  investment_income: number;
  contract_lump_sums: number;
  total_profit: number;
}

async function getAllInsuranceData(): Promise<InsuranceData[]> {
  const result = await pool.query("SELECT * FROM insurance.insurance;");
  return result.rows;
}

async function getAllAgeData(): Promise<AgeGroupData[]> {
  const result = await pool.query(`
  SELECT 
    CASE
      WHEN age BETWEEN 0 AND 9 THEN '0-9'
      WHEN age BETWEEN 10 AND 19 THEN '10-19'
      WHEN age BETWEEN 20 AND 29 THEN '20-29'
      WHEN age BETWEEN 30 AND 39 THEN '30-39'
      WHEN age BETWEEN 40 AND 49 THEN '40-49'
      WHEN age BETWEEN 50 AND 59 THEN '50-59'
      WHEN age BETWEEN 60 AND 69 THEN '60-69'
      WHEN age BETWEEN 70 AND 79 THEN '70-79'
      ELSE '80+'
    END AS age_group,
    COUNT(*) as customers
  FROM insurance.insurance
  GROUP BY age_group
  ORDER BY age_group;
  `);
  return result.rows;
}

async function getSex(): Promise<SexData[]> {
  const result = await pool.query(`
    SELECT sex, 
    COUNT(*) AS count
    FROM insurance.insurance
    GROUP BY sex;
  `);
  return result.rows;
}

async function getBMI(): Promise<BMIGroupData[]> {
  const result = await pool.query(`
    SELECT 
      CASE
        WHEN bmi BETWEEN 0 AND 9.9 THEN '0-9'
        WHEN bmi BETWEEN 10 AND 19.9 THEN '10-19'
        WHEN bmi BETWEEN 20 AND 29.9 THEN '20-29'
        WHEN bmi BETWEEN 30 AND 39.9 THEN '30-39'
        WHEN bmi BETWEEN 40 AND 49.9 THEN '40-49'
        WHEN bmi BETWEEN 50 AND 59.9 THEN '50-59'
        WHEN bmi BETWEEN 60 AND 69.9 THEN '60-69'
        WHEN bmi BETWEEN 70 AND 79.9 THEN '70-79'
        ELSE '80+'
      END AS bmi_group,
      COUNT(*) AS customers
    FROM insurance.insurance
    GROUP BY bmi_group
    ORDER BY bmi_group;
  `);
  return result.rows;
}

async function getAgeBMIFemale(): Promise<AgeBMIData[]> {
  const result = await pool.query(`
  SELECT age, bmi
  FROM insurance.insurance
  WHERE age IN (20, 30, 40, 50, 60, 70)
    AND sex = 'female'
  ORDER BY age;
  `);
  return result.rows;
}

async function getAgeBMIMale(): Promise<AgeBMIData[]> {
  const result = await pool.query(`
  SELECT age, bmi
  FROM insurance.insurance
  WHERE age IN (20, 30, 40, 50, 60, 70)
    AND sex = 'male'
  ORDER BY age;
  `);
  return result.rows;
}

async function avgBmi(): Promise<AvgBmiData[]> {
  const result = await pool.query(`
    SELECT 
      ROUND(AVG(bmi), 2) AS average_bmi, region
    FROM insurance.insurance
    GROUP BY region;
  `);
  return result.rows;
}

async function getSankeyInsuranceData(): Promise<SankeyData[]> {
  const result = await pool.query(`
    SELECT 
      SUM(insurance_premiums) AS insurance_premiums,
      SUM(investment_income) AS investment_income,
      SUM(contract_lump_sums) AS contract_lump_sums,
      SUM(insurance_premiums + investment_income + contract_lump_sums) AS revenue
    FROM public.insurance_profits;
  `);
  
  return result.rows;
}


export {
  getAllInsuranceData,
  getAllAgeData,
  getSex,
  getBMI,
  getAgeBMIFemale,
  getAgeBMIMale,
  avgBmi,
  getSankeyInsuranceData,
};
