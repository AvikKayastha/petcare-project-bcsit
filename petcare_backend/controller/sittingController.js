import sitting from '../models/sittingmodels.js';

export const submitsitting = async (req, res) => {
  try {
    const sitting = new sitting({
      name: req.body.name,
      email: req.body.email,
      pet_name: req.body.pet_name,
      pet_type: req.body.pet_type,
      date: req.body.date,
      days: req.body.days,
      message: req.body.message,
    });
    await sitting.save();
    res.status(201).json(sitting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
