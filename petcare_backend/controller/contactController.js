const Contact = required('../models/contact');
exports.submitContact = async (req, res) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        });
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  