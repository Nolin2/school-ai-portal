import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref:'Student', required:true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref:'Class', required:true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref:'Subject', required:true },
  term: String,
  year: Number,
  score: Number
});

export default mongoose.model('Marks', marksSchema);
