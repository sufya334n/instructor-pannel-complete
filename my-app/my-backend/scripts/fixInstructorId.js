import mongoose from "mongoose";
import Course from "../models/Course.js";

// TODO: Replace with your actual DB name
const MONGODB_URI = "mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

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