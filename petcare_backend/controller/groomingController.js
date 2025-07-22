import grooming from '../models/groomingmodels.js';
import grooming from '../models/groomingmodels.js';

export const submitgrooming = async (req, res) => {
  try {
    const grooming = new groominging({
      name: req.body.name,
      email: req.body.email,
      pet_name: req.body.pet_name,
      pet_type: req.body.pet_type,
      date: req.body.date,
      session: req.body.session,
      message: req.body.message,
    });
    await grooming.save();
    res.status(201).json(grooming);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
