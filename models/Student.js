import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => /^\d{10}$/.test(v),
      message: 'Phone number must be 10 digits'
    }
  },
  usnNo: { type: String, required: true, trim: true, unique: true }, // ✅ Added USN No.
  college: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  group: { type: String, required: true, trim: true },
  year: {
    type: String,
    required: true,
    validate: {
      validator: v => /^\d{4}$/.test(v),
      message: 'Year must be in YYYY format'
    }
  },
  registerDate: { type: Date, default: Date.now },
  quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Result' }]
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
