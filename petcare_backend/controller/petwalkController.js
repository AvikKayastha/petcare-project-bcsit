import Petwalk from "../models/petwalk.js";
export const submitPetwalk = async (req, res) => {
  try {
    const petwalk = new Petwalk({
      name: req.body.name,
      email: req.body.email,
      petName: req.body.petName,
      petType: req.body.petType,
      date: req.body.date,
      hours: req.body.hours,
      notes: req.body.notes,
    });
    await petwalk.save();
    return res.status(201).json({ message: "Petwalk saved successfully" });
  } catch (error) {
    console.error("Error saving petwalk:", error);
    return res.status(500).json({ message: "Server error while saving petwalk" });
  }
};