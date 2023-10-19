import mongoose from 'mongoose';

// Define the Room schema
const roomSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  members: [{ type:mongoose.Schema.Types.ObjectId, ref: "User" }],

  // members: [
  //   {
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'User', // Reference to the User model
  //       required: true,
  //     },
  //     joinedAt: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //   },
  // ],
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String, // This field is optional
  },
}, {
  timestamps: true,
});

// Create a Room model using the schema
const Room = mongoose.model('Room', roomSchema);

export default Room;
