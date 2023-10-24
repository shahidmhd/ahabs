import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
 }, // Assuming you have a Room model
  // roomId:String,
  {
    timestamps: true,
  },
);
// Create a Room model using the schema
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;


// import mongoose from 'mongoose';

// const chatSchema = new mongoose.Schema({
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   message: String,
//   roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
//   // Fields for file upload
//   files: [
//     {
//       data: Buffer, // Store binary file data
//       contentType: String, // Store file content type (e.g., 'image/jpeg', 'video/mp4', 'application/pdf', etc.)
//       filename: String, // Store the original filename
//     },
//   ],
// }, {
//   timestamps: true,
// });

// // Create a Room model using the schema
// const Chat = mongoose.model('Chat', chatSchema);

// export default Chat;
