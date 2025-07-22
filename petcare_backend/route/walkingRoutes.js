import express from 'express';
import { submitveterinary } from '../controller/trainingController.js';

const router = express.Router();

router.post('/training', submittraining);

export default router;
