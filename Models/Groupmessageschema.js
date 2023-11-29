import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  deleted:{type:Boolean,default:false},
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat' },
  replyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupChat', // Assuming you have a 'Chat' model for the referenced message
    default: null, // Default to null if not provided
  },
  deleteduser:[]
 }, 

 
  {
    timestamps: true,
  },
);
// Create a Room model using the schema
const Chat = mongoose.model('Groupmessage', chatSchema);

export default Chat;
