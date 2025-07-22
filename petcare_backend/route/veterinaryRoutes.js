import express from 'express';
import { submitvet} from '../controller/veterinaryController.js';

const router = express.Router();

router.post('/veterinary', submitvet);

export default router;
