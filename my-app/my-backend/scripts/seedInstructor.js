
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Instructor from '../models/Instructor.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const instructor = new Instructor({
    name: 'Test Instructor',
    email: 'instructor@example.com',
    password: 'test1234',
    verifiedInstructor: false, // Change to true to test login
  });

  await instructor.save();
  console.log('Sample instructor added:', instructor);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});