const { getAllInsuranceData, getAllAgeData,getSex, getBMI } = require('../models/insuranceModel');

async function getInsuranceData(req, res) {
    try {
      const data = await getAllInsuranceData();
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

async function getSexData(req,res){
  try{
    const data = await getSex();
    res.status(200).json(data);
  }catch (err) {
    console.error('Error fetching sex data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getBMIData(req,res) {
  try{
    const data = await getBMI();
    res.status(200).json(data);
  }catch (err) {
    console.error('Error fetching BMI data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  getInsuranceData,
  getAgeData,
  getSexData,
  getBMIData,
};
