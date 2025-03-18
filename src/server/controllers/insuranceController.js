// src/server/controllers/insuranceController.js
const { getAllInsuranceData, getAllAgeData } = require('../models/insuranceModel');

async function getInsuranceData(req, res) {
    try {
      console.log("Request to /insurance/data received");
      const data = await getAllInsuranceData();
      console.log(data);
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching insurance data:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
  

async function getAgeData(req, res) {
  try {
    const data = await getAllAgeData();
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching age data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  getInsuranceData,
  getAgeData
};
