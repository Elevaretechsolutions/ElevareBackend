// import express from 'express';
// import Student from '../models/Student.js';
// import Result from '../models/Result.js';
// import { adminAuth } from '../middleware/auth.js';

// const router = express.Router();

// // Get all students (admin only)
// router.get('/', adminAuth, async (req, res) => {
//   try {
//     const students = await Student.find().sort({ registerDate: -1 });
//     res.json(students);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get student by ID
// router.get('/:id', adminAuth, async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
    
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
    
//     res.json(student);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get student results
// router.get('/:id/results', adminAuth, async (req, res) => {
//   try {
//     const results = await Result.find({ student: req.params.id })
//       .sort({ completedAt: -1 });
    
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get all results (admin only)
// router.get('/results/all', adminAuth, async (req, res) => {
//   try {
//     const results = await Result.find()
//       .populate('student', 'name email college course')
//       .sort({ completedAt: -1 });
    
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;

import express from 'express';
import Student from '../models/Student.js';
import Result from '../models/Result.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all students (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const students = await Student.find().sort({ registerDate: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Place this BEFORE any dynamic route to avoid route conflicts
router.get('/results/all', adminAuth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email college course')
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student results by ID
router.get('/:id/results', adminAuth, async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.id })
      .sort({ completedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
