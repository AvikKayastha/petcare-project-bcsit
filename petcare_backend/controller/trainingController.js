import training from '../models/trainingmodels.js';

export const submittraining = async (req, res) => {
  try {
    const training = new training({
      name: req.body.name,
      email: req.body.email,
      pet_name: req.body.pet_name,
      pet_type: req.body.pet_type,
      date: req.body.date,
      session: req.body.session,
      message: req.body.message,
    });
    await training.save();
    res.status(201).json(training);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
