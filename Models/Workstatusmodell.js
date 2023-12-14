import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your user model is named 'User'
        required: true,
      },
    isPublic: {
      type: Boolean,
      default: false,
    },
    workTitle: {
      type: String,
      required: true,
    },
    workLocation: {
      type: String,
      required: true,
    },
    workingType: {
      type: String,
      required: true,
    },
    workingFor: {
      type: String,
      required: true,
    },
    typeofOrganization: {
      type: String,
      // You can add additional validation for organization type if needed
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    currentlyWorking: {
      type: Boolean,
      default: true,
    },
    dateOfResign: {
      type: Date,
    },
    developedSkills: {
      type: [String],
      default: [],
    },
  });
  
  const WorkModel = mongoose.model('Work', workSchema);
  export default WorkModel