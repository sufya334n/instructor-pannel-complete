// Script to set a default instructorAvatar for all instructors in the database
import mongoose from 'mongoose';
import Instructor from '../models/Instructor.js';

const MONGODB_URI = "mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0"; // <-- apna DB name yahan likhein
const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Instructor';

async function addInstructorAvatar() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Instructor.updateMany(
    { $or: [{ instructorAvatar: { $exists: false } }, { instructorAvatar: '' }] },
    { $set: { instructorAvatar: DEFAULT_AVATAR } }
  );
  console.log(`Updated ${result.modifiedCount || result.nModified} instructors with default avatar.`);
  await mongoose.disconnect();
}

addInstructorAvatar().catch(err => {
  console.error('Error updating instructor avatars:', err);
  process.exit(1);
}); 