import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import instructorRoutes from './routes/instructor.js';
import paidPayoutsRoutes from './routes/paidPayouts.js';

// Import models to ensure they are registered with Mongoose
import './models/User.js';
import './models/Instructor.js';
import './models/Course.js';
import './models/UnpaidPayout.js';
import './models/PaidPayout.js';


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());






// Import routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/paid-payouts', paidPayoutsRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://myappuser:mypassword123@cluster0.poq88ib.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Instructor backend running on port ${PORT}`));