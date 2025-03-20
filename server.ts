import { 
  getInsuranceData, 
  getAgeData, 
  getSexData, 
  getBMIData, 
  getAgeBMIFemaleData, 
  getAgeBMIMaleData,
  getAvgBmiData,
} from './src/server/controllers/insuranceController';

import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

// Enable CORS for your Angular app
app.use(cors());
app.use(express.json());

app.use('/insurance/data', getInsuranceData);
app.use('/insurance/age', getAgeData); 
app.use('/insurance/sex', getSexData);
app.use('/insurance/bmi', getBMIData);
app.use('/insurance/female-bmi', getAgeBMIFemaleData);
app.use('/insurance/male-bmi', getAgeBMIMaleData);
app.use('/insurance/avg-bmi', getAvgBmiData);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});