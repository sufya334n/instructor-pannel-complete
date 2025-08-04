// import UnpaidPayout from '../models/UnpaidPayout.js';

// export const getPendingPayouts = async (req, res) => {
//   try {
//     const instructorId = req.params.instructorId;

//     const payouts = await UnpaidPayout.find({ instructorId, paid: false })
//       .populate('courseId', 'title')
//       .populate('studentId', 'name')
//       .sort({ createdAt: -1 });


      
//     const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
//     const commissionRate = 0.7;
//     const instructorAmount = totalAmount * commissionRate;
//     const platformFee = totalAmount - instructorAmount;

//     res.json({
//       summary: {
//         totalAmount,
//         instructorAmount,
//         platformFee,
//         commissionRate: commissionRate * 100,
//       },
//       payouts,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };









// ✅ ES module imports
import UnpaidPayout from '../models/UnpaidPayout.js';
import Instructor from '../models/Instructor.js';

// ✅ Named export of the controller function
export const getPendingPayouts = async (req, res) => {
  try {
    const instructorId = req.params.instructorId;

    // ✅ Get instructor from DB
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    // ✅ Commission conversion (percentage to decimal)
    const commissionRate = instructor.commission
      ? instructor.commission / 100
      : 0.7; // fallback if undefined

    // ✅ Fetch unpaid payouts
    const payouts = await UnpaidPayout.find({ instructorId, paid: false })
      .populate('courseId', 'title')
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });

    // ✅ Calculate totals
    const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
    const instructorAmount = totalAmount * commissionRate;
    const platformFee = totalAmount - instructorAmount;

    // ✅ Format payouts for frontend
    const formattedPayouts = payouts.map(payout => ({
      _id: payout._id,
      amount: payout.amount,
      date: payout.createdAt,
      courseTitle: payout.courseId.title,
      studentName: payout.studentId.name,
    }));

    // ✅ Final response
    res.json({
      summary: {
        totalAmount,
        instructorAmount,
        platformFee,
        commissionRate: commissionRate * 100, // return as %
      },
      payouts: formattedPayouts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
