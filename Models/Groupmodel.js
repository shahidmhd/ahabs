import mongoose from 'mongoose'

const groupChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to a User schema (if you have one)
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User who sent the message
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      replies: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User who sent the reply
          },
          text: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

module.exports = GroupChat;
