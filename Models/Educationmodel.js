import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: true,
  },
  institutionName: {
    type: String,
  },
  termOfStudy: {
    type: String,
  },
  admissionDate: {
    type: Date,
  },
  stillStudying: {
    type: Boolean,
    default:false,
  },
  completionDate: {
    type: Date,
  },
  developedSkills: {
    type: [String],
    default: [],
  },
  isPublic: {
    type: Boolean,
    default:false,
  },
});

const EducationModel = mongoose.model('Education', educationSchema);

export default EducationModel;
