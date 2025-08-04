
  import mongoose from 'mongoose';

  const instructorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifiedInstructor: { type: Boolean, default: false },
    instructorAvatar: { type: String, default: '' },
    commission: { type: Number, default: 0.7 }, // 70% commission by default
    bio: { type: String, default: '' },
    stripeAccountId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  });

  const Instructor = mongoose.model('Instructor', instructorSchema);
  export default Instructor;