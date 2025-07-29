import express from 'express';
import { submitPetveterinary } from '../controller/petveterinaryController.js';

const router = express.Router();

router.post('/', submitPetveterinary);  // <-- Use the controller here

export default router;
