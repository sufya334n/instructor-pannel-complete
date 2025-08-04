import express from 'express';
import { getPaidPayouts } from '../controllers/paidPayoutController.js';

const router = express.Router();

router.get('/:instructorId', getPaidPayouts);

export default router;