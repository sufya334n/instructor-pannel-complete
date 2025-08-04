import mongoose from 'mongoose';

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = 'mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0';

async function addCourseVerifiedField() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Get the courses collection
    const db = mongoose.connection.db;
    const coursesCollection = db.collection('courses');

    // Update all documents to add courseVerified field
    const result = await coursesCollection.updateMany(
      {}, // Update all documents
      {
        $set: {
          courseVerified: false // Default value for courseVerified field
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} documents in courses collection`);
    console.log('Successfully added courseVerified field to all courses');

    // Verify the update by checking a few documents
    const sampleCourses = await coursesCollection.find({}).limit(3).toArray();
    console.log('\nSample courses after update:');
    sampleCourses.forEach((course, index) => {
      console.log(`Course ${index + 1}: ${course.title} - courseVerified: ${course.courseVerified}`);
    });

  } catch (error) {
    console.error('Error adding courseVerified field:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
addCourseVerifiedField(); 