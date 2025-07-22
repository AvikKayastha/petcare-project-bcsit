import express from 'express';
import { submittraining } from '../controller/trainingController.js';

const router = express.Router();

router.post('/training', submittraining);

export default router;
