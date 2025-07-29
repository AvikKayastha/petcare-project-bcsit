import express from 'express';
import { submitPetgrooming } from '../controller/petgroomingController.js';

const router = express.Router();

router.post('/', submitPetgrooming);

export default router;
