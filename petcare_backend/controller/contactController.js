import Contact from "../models/contact.js";
export const submitContact = async (req, res) => {
  try {
    const contact = new Contact({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });
    await contact.save();
    return res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    console.error("Error saving contact:", error);
    return res.status(500).json({ message: "Server error while saving contact" });
  }
};
