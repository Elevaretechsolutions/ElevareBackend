import express from 'express';
import Question from '../models/Question.js';
import Student from '../models/Student.js';
import Result from '../models/Result.js';
import { studentAuth } from '../middleware/auth.js';

const router = express.Router();

// Get quiz questions for students
router.get('/questions', async (req, res) => {
  try {
    // Get a random selection of questions
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    
    const filter = category ? { category } : {};
    
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: limit } },
      { $project: { 
        text: 1, 
        options: { $map: { 
          input: "$options", 
          as: "option", 
          in: { text: "$$option.text", _id: "$$option._id" } 
        }},
        category: 1,
        difficulty: 1
      }}
    ]);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit quiz answers
router.post('/submit', studentAuth, async (req, res) => {
  try {
    const { answers } = req.body;
    const studentId = req.studentId;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid submission format' });
    }
    
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Process each answer and calculate score
    let score = 0;
    const processedAnswers = [];
    
    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      
      if (!question) {
        continue;
      }
      
      const selectedOption = question.options.find(
        opt => opt._id.toString() === answer.optionId
      );
      
      const isCorrect = selectedOption?.isCorrect || false;
      
      if (isCorrect) {
        score++;
      }
      
      processedAnswers.push({
        question: question._id,
        selectedOption: answer.optionId,
        isCorrect
      });
    }
    
    // Create result
    const result = new Result({
      student: studentId,
      score,
      totalQuestions: answers.length,
      answers: processedAnswers
    });
    
    await result.save();
    
    // Update student's quizzes taken
    student.quizzesTaken.push(result._id);
    await student.save();
    
    res.json({
      score,
      totalQuestions: answers.length,
      resultId: result._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get quiz result by ID
router.get('/result/:id', studentAuth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', 'name email')
      .populate({
        path: 'answers.question',
        model: 'Question',
        select: 'text options'
      });
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;


