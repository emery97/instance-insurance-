const insuranceModel = require('../models/insuranceModel'); // Import model

async function getInsuranceData(req,res){
    try{
        const data = await insuranceModel.getAllInsuranceData();
        res.json(data);
    }catch(error){
        console.error(error.message);
        res.status(500).send('Server error'); 
    }
}

module.exports = {
    getInsuranceData
}
