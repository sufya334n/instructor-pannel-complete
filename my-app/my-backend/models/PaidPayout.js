import mongoose from 'mongoose';

const paidPayoutSchema = new mongoose.Schema({
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true,
  },
  platformCut: {
    type: Number,
    required: true,
  },
  instructorAmount: {
    type: Number,
    required: true,
  },
  unpaidIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UnpaidPayout',
    },
  ],
  payoutAt: {
    type: Date,
    default: Date.now,
  },
});

const PaidPayout = mongoose.model('PaidPayout', paidPayoutSchema);

export default PaidPayout;