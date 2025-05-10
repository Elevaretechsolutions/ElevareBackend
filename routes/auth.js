import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register student
router.post('/student/register', async (req, res) => {
  try {
    const { name, email, phone, college, course, year, usnNo, group } = req.body;

    // Check if the student already exists by email
    const existingStudentByEmail = await Student.findOne({ email });
    if (existingStudentByEmail) {
      return res.status(400).json({ message: 'Student already registered with this email' });
    }

    // Check if the student already exists by USN
    const existingStudentByUSN = await Student.findOne({ usnNo });
    if (existingStudentByUSN) {
      return res.status(400).json({ message: 'Student already registered with this USN' });
    }

    // Create new student object if both checks pass
    const student = new Student({
      name,
      email,
      phone,
      college,
      course,
      year,
      usnNo,
      group,
    });

    // Save the student to the database
    await student.save();

    // Generate JWT Token for the student
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set the token in a cookie
    res.cookie('studentToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Respond with success
    res.status(201).json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        usnNo: student.usnNo,
        group: student.group
      }
    });
  } catch (error) {
    console.error('Error during student registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.clearCookie('studentToken');
  res.json({ success: true });
});

// Initial admin setup
router.post('/setup', async (req, res) => {
  try {
    const adminExists = await Admin.countDocuments();

    if (adminExists > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      name: 'Administrator'
    });

    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current admin
router.get('/admin/me', adminAuth, (req, res) => {
  res.json({
    id: req.admin._id,
    name: req.admin.name,
    username: req.admin.username
  });
});

export default router;
