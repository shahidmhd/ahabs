import mongoose from 'mongoose'

const groupChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  latestmessage:{ type:mongoose.Schema.Types.ObjectId, ref: "Groupmessage" },
  createdBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    }
  ],
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to a User schema (if you have one)
    },
  ],
  image: {
    type: String, // You might consider using a different type based on your image storage strategy (e.g., Buffer for binary data)
  }
},{
  timestamps:true
});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;