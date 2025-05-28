import express from 'express';
import Feedback from '../models/Feedback.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// GET all feedbacks - Public access
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ timestamp: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('❌ Error retrieving feedbacks:', error.message);
    res.status(500).json({ error: 'Failed to retrieve feedbacks' });
  }
});

// POST feedback(s) - Admin protected
// Accepts either a single object or an array of objects
router.post('/', adminAuth, async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ error: 'No feedback data provided' });
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({ error: 'Feedback array is empty' });
      }

      // Optional: validate each object for required fields before inserting (optional but recommended)
      // You can add a function to check all fields exist

      const feedbacks = await Feedback.insertMany(data);
      return res.status(201).json({
        message: `✅ ${feedbacks.length} feedback(s) submitted successfully`,
        count: feedbacks.length,
        feedbacks,
      });
    } else if (typeof data === 'object') {
      // Single feedback case
      const feedback = new Feedback(data);
      await feedback.save();
      return res.status(201).json({
        message: '✅ Single feedback submitted successfully',
        feedback,
      });
    } else {
      // If the request body is neither an object nor array
      return res.status(400).json({ error: 'Invalid feedback data format' });
    }
  } catch (error) {
    console.error('❌ Feedback submission error:', error.message);
    // To help debugging, you could send error.message in dev but be careful in production
    return res.status(500).json({ error: 'Failed to submit feedback(s)' });
  }
});

export default router;
