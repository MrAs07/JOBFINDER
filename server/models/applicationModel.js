import mongoose, {Schema} from "mongoose"

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs',
    required: [true, 'Job is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'User  is required'],
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume URL is required'],
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'],
    default: 'Applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;