import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  // roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' }, // Assuming you have a Room model
  roomId:String,
  timestamp: { type: Date, default: Date.now },
});
// Create a Room model using the schema
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
