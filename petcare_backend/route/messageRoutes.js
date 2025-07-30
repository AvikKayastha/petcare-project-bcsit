import express from 'express';
import Contact from '../models/contact.js';

const router = express.Router();

router.get('/admin/messages', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('messages', { contacts });
  } catch (err) {
    console.error('Failed to load messages:', err);  
    res.status(500).send('Error loading messages');
  }
});


export default router;
