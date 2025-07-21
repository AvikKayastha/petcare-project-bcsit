import express from 'express';
import { submitsitting } from '../controller/sittingController.js';

const router = express.Router();

router.post('/sitting', submitsitting);

export default router;
