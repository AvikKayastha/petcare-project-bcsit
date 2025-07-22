import boarding from '../models/boardingmodels.js';

export const submitboarding = async (req, res) => {
  try {
    const boarding = new boarding({
      name: req.body.name,
      email: req.body.email,
      pet_name: req.body.pet_name,
      pet_type: req.body.pet_type,
      date: req.body.date,
      days: req.body.days,
      message: req.body.message,
    });
    await boarding.save();
    res.status(201).json(boarding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
