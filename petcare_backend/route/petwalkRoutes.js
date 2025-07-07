import express from 'express';
import { submitPetwalk } from '../controller/petwalkController.js';

const router = express.Router();

router.post('/petwalk', submitPetwalk);

export default router;