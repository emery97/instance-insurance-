import { Request, Response } from 'express';
import { getAllInsuranceData, getAllAgeData, getSex, getBMI, getAgeBMIFemale, getAgeBMIMale } from '../models/insuranceModel';

// Type for the response data (adjust based on the actual return type from the functions)
type DataResponse = {
  [key: string]: any; // You should replace `any` with the specific type of data returned from each function
};

async function getInsuranceData(req: Request, res: Response): Promise<void> {
  try {
    const data: DataResponse = await getAllInsuranceData();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching insurance data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getAgeData(req: Request, res: Response): Promise<void> {
  try {
    const data: DataResponse = await getAllAgeData();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching age data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getSexData(req: Request, res: Response): Promise<void> {
  try {
    const data: DataResponse = await getSex();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching sex data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getBMIData(req: Request, res: Response): Promise<void> {
  try {
    const data: DataResponse = await getBMI();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching BMI data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getAgeBMIFemaleData(req: Request, res: Response): Promise<void> {
  try {
    const data: DataResponse = await getAgeBMIFemale();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching Age BMI Female data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function getAgeBMIMaleData(req: Request, res: Response): Promise<void> {
  try {
    const data: DataResponse = await getAgeBMIMale();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error fetching Age BMI male data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export {
  getInsuranceData,
  getAgeData,
  getSexData,
  getBMIData,
  getAgeBMIFemaleData,
  getAgeBMIMaleData,
};
