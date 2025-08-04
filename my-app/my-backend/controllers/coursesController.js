import Course from '../models/Course.js';
import mongoose from 'mongoose';

export async function getCoursesByInstructor(req, res) {
  try {
    const { instructorId } = req.params;
    
    // Debug: Check all courses first
    const allCourses = await Course.find({});
    console.log('All courses in database:', allCourses.length);
    console.log('Sample course instructorId:', allCourses[0]?.instructorId);
    console.log('Sample course instructorId type:', typeof allCourses[0]?.instructorId);
    
    // Now search as ObjectId since we converted all instructorId to ObjectId
    const courses = await Course.find({ instructorId: new mongoose.Types.ObjectId(instructorId) });
    console.log('Searching for instructorId:', instructorId);
    console.log('Found courses:', courses.length);
    
    res.json(courses);
  } catch (err) {
    console.error('Get courses error:', err);
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
}

export async function addCourse(req, res) {
  try {
    const course = new Course({ ...req.body, updatedAt: new Date() });
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    console.error('Get courses error:', err); // Yeh line add karein
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
} 
