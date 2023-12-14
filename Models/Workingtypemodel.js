import mongoose from 'mongoose'

const worktypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const worktypeModel = mongoose.model('worktype', worktypeSchema);

export default worktypeModel;




