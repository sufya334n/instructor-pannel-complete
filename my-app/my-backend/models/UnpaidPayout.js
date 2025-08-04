import mongoose from 'mongoose';

const unpaidPayoutSchema = new mongoose.Schema({
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const UnpaidPayout = mongoose.model('UnpaidPayout', unpaidPayoutSchema);
export default UnpaidPayout;
