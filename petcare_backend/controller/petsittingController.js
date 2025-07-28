import Petsitting from '../models/petsitting.js';

export const submitPetsitting = async (req, res) => {
  console.log('Request Body:', req.body); // Debug

  try {
    const newSitting = new Petsitting({
      name: req.body.name,
      email: req.body.email,
      petName: req.body.petName,
      petType: req.body.petType,
      date: req.body.date,
      hours: req.body.hours,
      notes: req.body.notes,
    });

    const saved = await newSitting.save();
    console.log('Saved document:', saved); // Debug
    return res.status(201).json({ message: "Petsitting saved successfully" });
  } catch (error) {
    console.error("Error saving petsitting:", error);
    return res.status(500).json({ message: "Server error while saving petsitting" });
  }
};
