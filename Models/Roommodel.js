import mongoose from 'mongoose';

// Define the Room schema
const roomSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  members: [{ type:mongoose.Schema.Types.ObjectId, ref: "User" }],
  latestmessage:{ type:mongoose.Schema.Types.ObjectId, ref: "Chat" },
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String, // This field is optional
  },
  messageCount:{
    type:Number,
  }
}, {
  timestamps: true,
});

// Create a Room model using the schema
const Room = mongoose.model('Room', roomSchema);

export default Room;
