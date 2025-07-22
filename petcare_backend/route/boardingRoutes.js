import express from 'express';
import { submitboarding } from '../controller/boardingController.js';

const router = express.Router();

router.post('/boarding', submitboarding);

export default router;
