import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  name: { type: String, required: true },
  section: { type: String, required: true },
  batch: { type: String, required: true },
  usnNumber: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  feedback: { type: String, required: true }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
