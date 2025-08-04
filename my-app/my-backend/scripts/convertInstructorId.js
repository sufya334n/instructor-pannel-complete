import mongoose from "mongoose";
import Course from "../models/Course.js";

const MONGODB_URI = "mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

async function convertInstructorIds() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses`);

    let updated = 0;

    for (const course of courses) {
      // Force convert instructorId to ObjectId
      if (course.instructorId) {
        const oldInstructorId = course.instructorId;
        course.instructorId = new mongoose.Types.ObjectId(course.instructorId.toString());
        await course.save();
        updated++;
        console.log(`Updated course ${course._id}: ${oldInstructorId} -> ${course.instructorId}`);
      }
    }

    console.log(`\n✅ Done! Updated ${updated} courses`);
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

convertInstructorIds(); 