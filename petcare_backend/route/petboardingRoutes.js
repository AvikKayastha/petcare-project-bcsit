import express from 'express';
import { submitPetboarding } from '../controller/petboardingController.js';

const router = express.Router();

router.post('/', submitPetboarding);

export default router;
