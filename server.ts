import { 
  getInsuranceData, 
  getAgeData, 
  getSexData, 
  getBMIData, 
  getAgeBMIFemaleData, 
  getAgeBMIMaleData,
  getAvgBmiData,
  getInsurancePremiumData,
  getInsuranceInvestmentData,
  getInsuranceContractLSData,
} from './src/server/controllers/insuranceController';

import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

// Enable CORS for your Angular app
// Enable CORS for requests from localhost:4200
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());

app.use('/insurance/data', getInsuranceData);
app.use('/insurance/age', getAgeData); 
app.use('/insurance/sex', getSexData);
app.use('/insurance/bmi', getBMIData);
app.use('/insurance/female-bmi', getAgeBMIFemaleData);
app.use('/insurance/male-bmi', getAgeBMIMaleData);
app.use('/insurance/avg-bmi', getAvgBmiData);
app.use('/insurance/premium', getInsurancePremiumData);
app.use('/insurance/investment', getInsuranceInvestmentData);
app.use('/insurance/contract-lump-sum', getInsuranceContractLSData);
app.use('/insurance/profit', getInsuranceContractLSData);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});