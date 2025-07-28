import express from 'express';
import { submitPetsitting } from '../controller/petsittingController.js';

const router = express.Router();

router.post('/', submitPetsitting);  // <-- Use the controller here

export default router;