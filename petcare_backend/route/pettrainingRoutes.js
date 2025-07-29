import express from 'express';
import { submitPettraining } from '../controller/pettrainingController.js';

const router = express.Router();

router.post('/', submitPettraining);  // <-- Use the controller here

export default router;