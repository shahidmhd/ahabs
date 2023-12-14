import mongoose from 'mongoose'

const DresstypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const dresstypeModel = mongoose.model('dresstype', DresstypeSchema);

export default dresstypeModel;




