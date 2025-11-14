import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  gender: String,
  dob: Date,
  admissionNumber: { type: String, required:true, unique:true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref:'Class' },
  parentPhone: String,
  boarding: { type: String, enum:['day','boarder'], default:'day' },
  prefect: { type: Boolean, default:false },
  admissionDate: { type: Date, default: Date.now }
});

export default mongoose.model('Student', studentSchema);
