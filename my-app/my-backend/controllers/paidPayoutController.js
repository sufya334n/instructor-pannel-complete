import PaidPayout from '../models/PaidPayout.js';
import Instructor from '../models/Instructor.js';

export const getPaidPayouts = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    const paidPayouts = await PaidPayout.find({ instructorId })
      .populate({
        path: 'unpaidIds',
        populate: [
          { path: 'courseId', select: 'title' },
          { path: 'studentId', select: 'name' }
        ]
      })
      .sort({ payoutAt: -1 });

    const formattedPaidPayouts = paidPayouts.map(payout => ({
      _id: payout._id,
      instructorId: payout.instructorId,
      platformCut: payout.platformCut,
      payoutAt: payout.payoutAt,
      instructorAmount: payout.instructorAmount,
      items: payout.unpaidIds.map(item => ({
        _id: item._id,
        amount: item.amount,
        paidAt: item.createdAt,
        courseTitle: item.courseId ? item.courseId.title : 'N/A',
        studentName: item.studentId ? item.studentId.name : 'N/A',
      })),
    }));

    res.status(200).json({ paidPayouts: formattedPaidPayouts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};