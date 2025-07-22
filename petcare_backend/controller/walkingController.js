import walking from '../models/walkingmodels.js';


export const submitwalking = async (req, res) => {
  try {
    const walking = new walking({
      name: req.body.name,
      email: req.body.email,
      pet_name: req.body.pet_name,
      pet_type: req.body.pet_type,
      date: req.body.date,
      hours: req.body.hours,
      message: req.body.message,
    });
    await walking.save();
    res.status(201).json(walking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
