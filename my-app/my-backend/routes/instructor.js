import express from 'express';
import Instructor from '../models/Instructor.js';


import { getPendingPayouts } from '../controllers/payoutController.js';







const router = express.Router();

// GET /api/instructor/:id - Get instructor by ID
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    res.json({ success: true, instructor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching instructor', error: error.message });
  }
});

// PUT /api/instructor/:id - Update instructor by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedInstructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }
    res.json({ success: true, message: 'Instructor updated successfully', instructor: updatedInstructor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating instructor', error: error.message });
  }
});







// GET pending payouts for instructor
router.get('/pending-payouts/:instructorId', getPendingPayouts);







export default router; 












