import express from 'express';
import { submitPetsitting } from '../controller/petsittingController.js';

const router = express.Router();
router.post('/petsitting', submitPetsitting);
export default router;
