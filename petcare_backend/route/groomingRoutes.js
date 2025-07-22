import express from 'express';
import { submitgrooming } from '../controller/groomingController.js';

const router = express.Router();

router.post('/grooming', submitgrooming);

export default router;
