const insuranceController = require('./src/server/controllers/insuranceController');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for your Angular app
app.use(cors());
app.use(express.json());

app.use('/insurance/data', insuranceController.getInsuranceData);
app.use('/insurance/age', insuranceController.getAllAgeData); 
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});