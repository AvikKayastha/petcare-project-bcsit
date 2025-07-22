import express from 'express';
import { submitwalking } from '../controller/walkingController.js';

const router = express.Router();

router.post('/walking', submitwalking);

export default router;
