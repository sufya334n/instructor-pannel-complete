import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  instructorAvatar: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  lessons: {
    type: Number,
    required: true,
    default: 0
  },
  duration: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  category: {
    name:{type: String, required: true},
    icon: {type: String}
  },
  tags: [{
    type: String,
    trim: true
  }],
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  videos: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  }],
  description: [{
    heading: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    }
  }],
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseVerified: {
    type: Boolean,
    default: false
  },
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  editCourse: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt
});

// Add indexes for better query performance
courseSchema.index({ instructorId: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ courseVerified: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course; 