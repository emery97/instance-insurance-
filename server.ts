import * as InsuranceController from './src/server/controllers/insuranceController';
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

app.use('/insurance/data', InsuranceController.getInsuranceData);
app.use('/insurance/age', InsuranceController.getAgeData); 
app.use('/insurance/sex', InsuranceController.getSexData);
app.use('/insurance/bmi', InsuranceController.getBMIData);
app.use('/insurance/female-bmi', InsuranceController.getAgeBMIFemaleData);
app.use('/insurance/male-bmi', InsuranceController.getAgeBMIMaleData);
app.use('/insurance/avg-bmi', InsuranceController.getAvgBmiData);
app.use('/insurance/sankey-revenue', InsuranceController.getAllSankeyInsuranceData);
app.use('/insurance/sankey-expenses', InsuranceController.getAllSankeyExpensesData);
app.use('/insurance/sankey-profit', InsuranceController.getAllSankeyProfitData);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});