import Pettraining from '../models/pettraining.js';

export const submitPettraining = async (req, res) => {
  console.log('Request Body:', req.body); // Debug

  try {
    const newtraining = new Pettraining({
      name: req.body.name,
      email: req.body.email,
      petName: req.body.petName,
      petType: req.body.petType,
      date: req.body.date,
      hours: req.body.hours,
      notes: req.body.notes,
    });

    const saved = await newtraining.save();
    console.log('Saved document:', saved); 
    return res.status(201).json({ message: "Pettraining saved successfully" });
  } catch (error) {
    console.error("Error saving pe:", error);
    return res.status(500).json({ message: "Server error while saving pettraining" });
  }
};
