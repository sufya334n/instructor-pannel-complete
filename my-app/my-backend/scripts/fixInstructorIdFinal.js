import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0";

async function fixInstructorId() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Direct MongoDB update
    const db = mongoose.connection.db;
    const result = await db.collection('courses').updateMany(
      { instructorId: { $type: "string" } },
      [
        {
          $set: {
            instructorId: { $toObjectId: "$instructorId" }
          }
        }
      ]
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    console.log("✅ Done! instructorId converted to ObjectId");
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

fixInstructorId(); 