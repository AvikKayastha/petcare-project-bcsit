import Petgrooming from '../models/petgrooming.js';

export const submitPetgrooming = async (req, res) => {
  console.log('Request Body:', req.body); // Debug

  try {
    const newGrooming = new Petgrooming({
      name: req.body.name,
      email: req.body.email,
      petName: req.body.petName,
      petType: req.body.petType,
      date: req.body.date,
      hours: req.body.hours,
      notes: req.body.notes,
    });

    const saved = await newGrooming.save();
    console.log('Saved document:', saved); 
    return res.status(201).json({ message: "Petgrooming saved successfully" });
  } catch (error) {
    console.error("Error saving petgrooming:", error);
    return res.status(500).json({ message: "Server error while saving petgrooming" });
  }
};
