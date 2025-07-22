import veterinary from '../models/veterinarymodels.js';


export const submitvet = async (req, res) => {
  try {
    const veterinary = new veterinary({
      name: req.body.name,
      email: req.body.email,
      pet_name: req.body.pet_name,
      pet_type: req.body.pet_type,
      date: req.body.date,
      visit: req.body.visit,
      message: req.body.message,
    });
    await veterinary.save();
    res.status(201).json(veterinary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
