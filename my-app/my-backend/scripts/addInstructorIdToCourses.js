// fixInstructorId.js
import mongoose from "mongoose";
import Course from "../models/Course.js";

// MongoDB connection string (update if needed)
const MONGODB_URI = "mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0"; // <-- apna DB name yahan likhein

async function fixInstructorIds() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const courses = await Course.find({});
  let updated = 0;

  for (const course of courses) {
    if (course.instructorId && typeof course.instructorId === "string" && course.instructorId.length === 24) {
      course.instructorId = new mongoose.Types.ObjectId(course.instructorId);
      await course.save();
      updated++;
      console.log(`Updated course: ${course._id}`);
    }
  }

  console.log(`Done! Total updated: ${updated}`);
  await mongoose.disconnect();
}

fixInstructorIds().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});




















// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0';

// const courseSchema = new mongoose.Schema({}, { strict: false });
// const Course = mongoose.model('Course', courseSchema, 'courses');

// async function updateCourses() {
//   await mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   // Dummy instructorId (replace with real one as needed)
//   const dummyInstructorId = '000000000000000000000000';
//   const now = new Date();

//   // 1. Rename 'date' to 'createdAt' if exists
//   const renameResult = await Course.updateMany(
//     { date: { $exists: true }, createdAt: { $exists: false } },
//     [{ $set: { createdAt: "$date" } }, { $unset: "date" }]
//   );

//   // 2. Add 'updatedAt' field to all documents
//   const updatedAtResult = await Course.updateMany(
//     {},
//     { $set: { updatedAt: now } }
//   );

//   // 3. Add 'instructorId' if missing
//   const instructorIdResult = await Course.updateMany(
//     { instructorId: { $exists: false } },
//     { $set: { instructorId: dummyInstructorId } }
//   );

//   console.log('Renamed date to createdAt:', renameResult.modifiedCount || renameResult.nModified || 0);
//   console.log('Set updatedAt for all courses:', updatedAtResult.modifiedCount || updatedAtResult.nModified || 0);
//   console.log('Set instructorId for missing:', instructorIdResult.modifiedCount || instructorIdResult.nModified || 0);

//   await mongoose.disconnect();
// }

// updateCourses().catch(err => {
//   console.error('Script error:', err);
//   process.exit(1);
// });