import Petsitting from '../models/petsitting.js';

export const submitPetsitting = async (req, res) => {
  try {
    const newSitting = new Petsitting({
      name: req.body.name,
      email: req.body.email,
      PetName: req.body.petName,
      PetType: req.body.petType,
      date: req.body.date,
      hours: req.body.hours,
      notes: req.body.notes,
    });

    await newSitting.save();
    return res.status(201).json({ message: "Petsitting saved successfully" });
  } catch (error) {
    console.error("Error saving petsitting:", error);
    return res.status(500).json({ message: "Server error while saving petsitting" });
  }
};
