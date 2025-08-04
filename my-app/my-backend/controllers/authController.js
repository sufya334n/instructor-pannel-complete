import Instructor from '../models/Instructor.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    const existingInstructor = await Instructor.findOne({ email });
    if (existingInstructor) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const instructor = new Instructor({ name, email, password, verifiedInstructor: false });
    await instructor.save();
    res.status(201).json({ message: 'Registration successful. Await admin verification.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const instructor = await Instructor.findOne({ email, password });
    if (!instructor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!instructor.verifiedInstructor) {
      return res.status(403).json({ message: 'Your account is not verified by admin.' });
    }
    // Print to terminal on successful login
    console.log(`Instructor logged in: Name = ${instructor.name}, ID = ${instructor._id}`);
    res.json({ message: 'Login successful', user: { id: instructor._id, name: instructor.name, email: instructor.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
} 