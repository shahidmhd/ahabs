import mongoose from 'mongoose'

const profiletypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const ProfiletypeModel = mongoose.model('profiletype', profiletypeSchema);

export default ProfiletypeModel;




