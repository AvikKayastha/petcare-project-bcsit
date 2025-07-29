import Petveterinary from '../models/petveterinary.js';

export const submitPetveterinary = async (req, res) => {
  console.log('Request Body:', req.body); // Debug

  try {
    const newveterinary = new Petveterinary({
      name: req.body.name,
      email: req.body.email,
      petName: req.body.petName,
      petType: req.body.petType,
      date: req.body.date,
      hours: req.body.hours,
      notes: req.body.notes,
    });

    const saved = await newveterinary.save(); 
    console.log('Saved document:', saved);

    return res.status(201).json({ message: "Petveterinary saved successfully" });
  } catch (error) {
    console.error("Error saving petveterinary:", error);
    return res.status(500).json({ message: "Server error while saving petveterinary" });
  }
};
