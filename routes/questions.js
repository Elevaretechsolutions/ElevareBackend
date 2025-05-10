// import express from 'express';
// import Question from '../models/Question.js';
// import { adminAuth } from '../middleware/auth.js';

// const router = express.Router();

// // Get all questions (admin only)
// router.get('/', adminAuth, async (req, res) => {
//   try {
//     const questions = await Question.find().sort({ createdAt: -1 });
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get question by ID
// router.get('/:id', adminAuth, async (req, res) => {
//   try {
//     const question = await Question.findById(req.params.id);
    
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }
    
//     res.json(question);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create new question
// router.post('/', adminAuth, async (req, res) => {
//   try {
//     const { text, options, category, difficulty } = req.body;
    
//     // Validate options
//     if (!options || options.length < 2) {
//       return res.status(400).json({ message: 'Question must have at least 2 options' });
//     }
    
//     // Check if at least one option is correct
//     const hasCorrectOption = options.some(option => option.isCorrect);
//     if (!hasCorrectOption) {
//       return res.status(400).json({ message: 'Question must have at least one correct option' });
//     }
    
//     const question = new Question({
//       text,
//       options,
//       category,
//       difficulty,
//       createdBy: req.admin._id
//     });
    
//     await question.save();
    
//     res.status(201).json(question);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Update question
// router.put('/:id', adminAuth, async (req, res) => {
//   try {
//     const { text, options, category, difficulty } = req.body;
    
//     // Validate options
//     if (options && options.length < 2) {
//       return res.status(400).json({ message: 'Question must have at least 2 options' });
//     }
    
//     // Check if at least one option is correct
//     if (options && !options.some(option => option.isCorrect)) {
//       return res.status(400).json({ message: 'Question must have at least one correct option' });
//     }
    
//     const question = await Question.findByIdAndUpdate(
//       req.params.id,
//       { text, options, category, difficulty },
//       { new: true }
//     );
    
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }
    
//     res.json(question);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Delete question
// router.delete('/:id', adminAuth, async (req, res) => {
//   try {
//     const question = await Question.findByIdAndDelete(req.params.id);
    
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }
    
//     res.json({ message: 'Question deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// export default router;




import express from 'express';
import Question from '../models/Question.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all questions (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get question by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new question
router.post('/', adminAuth, async (req, res) => {
  try {
    const { text, options, category, difficulty } = req.body;
    
    // Validate options
    if (!options || options.length < 2) {
      return res.status(400).json({ message: 'Question must have at least 2 options' });
    }
    
    // Check if at least one option is correct
    const hasCorrectOption = options.some(option => option.isCorrect);
    if (!hasCorrectOption) {
      return res.status(400).json({ message: 'Question must have at least one correct option' });
    }
    
    const question = new Question({
      text,
      options,
      category,
      difficulty,
      createdBy: req.admin._id
    });
    
    await question.save();
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update question
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { text, options, category, difficulty } = req.body;
    
    // Validate options
    if (options && options.length < 2) {
      return res.status(400).json({ message: 'Question must have at least 2 options' });
    }
    
    // Check if at least one option is correct
    if (options && !options.some(option => option.isCorrect)) {
      return res.status(400).json({ message: 'Question must have at least one correct option' });
    }
    
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { text, options, category, difficulty },
      { new: true }
    );
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete question
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
