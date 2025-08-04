import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

const router = express.Router();

// Utility: Validate required course fields
const validateCourseInput = (data) => {
  const { title, instructor } = data;
  if (!title || !instructor) {
    return 'Title and instructor are required';
  }
  return null;
};
// Get distinct categories from courses collection
router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.aggregate([
      {
        $match: { "category.name": { $exists: true, $ne: "" } } // sirf wo documents jisme name hai
      },
      {
        $group: {
          _id: "$category.name",
          icon: { $first: "$category.icon" }
        }
      },
      {
        $project: {
          name: "$_id",
          icon: 1,
          _id: 0
        }
      }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// ✅ POST /api/courses - Create a new course
router.post('/', async (req, res) => {
  try {
    const error = validateCourseInput(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const courseData = {
      ...req.body,
      category: req.body.category || '', // fallback if category is missing
    };

    const course = new Course(courseData);
    const savedCourse = await course.save();

    res.status(201).json({ success: true, course: savedCourse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ PUT /api/courses/:id - Update an existing course
router.put('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const error = validateCourseInput(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        ...req.body,
        category: req.body.category || '',
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, course: updatedCourse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




// GET /api/courses/instructor/:instructorId - Get courses by instructor ID
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ success: false, message: 'Invalid instructor ID' });
    }

    const courses = await Course.find({ instructorId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: 'No courses found for this instructor' });
    }

    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});









export default router;
