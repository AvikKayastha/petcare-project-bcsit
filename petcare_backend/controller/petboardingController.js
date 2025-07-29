import submitPetboarding from '../models/petboarding.js';

export const submitPetboarding = async (req, res) => {
  console.log('Request Body:', req.body); // Debug

  try {
    const newboarding = new Petboarding({
      name: req.body.name,
      email: req.body.email,
      petName: req.body.petName,
      petType: req.body.petType,
      date: req.body.date,
      hours: req.body.hours,
      notes: req.body.notes,
    });

    const saved = await newboarding.save();
    console.log('Saved document:', saved); 
    return res.status(201).json({ message: "Petboarding saved successfully" });
  } catch (error) {
    console.error("Error saving petboarding:", error);
    return res.status(500).json({ message: "Server error while saving petboarding" });
  }
};
