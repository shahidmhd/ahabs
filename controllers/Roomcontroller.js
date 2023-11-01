import Room from "../Models/Roommodel.js";
import Chat from "../Models/Chatsamplemodel.js";
import User from "../Models/Usermodel.js"
import AppError from "../utils/AppError.js";


export const createuseroom = async (req, res, next) => {
  try {
    const selectedUserId = req.params.id;
    const createdByUserId = req.userId;

    // Check if a room with the same members exists
    const existingRoom = await Room.findOne({
      $and: [
        { members: selectedUserId },
        { members: createdByUserId },
      ],
    });

    if (existingRoom) {
      // If a room with the same members exists, return the existing room
      return res.status(200).json(existingRoom);
    }

    const newRoomName = `Room_${Date.now()}`;

    // Create a new room
    const newRoom = new Room({
      createdBy: createdByUserId,
      members: [selectedUserId, createdByUserId],
      name: newRoomName,
    });

    const room = await newRoom.save();

    res.status(201).json(room);
  } catch (err) {
    console.error('Error creating or checking the room:', err);
    next(err);
  }
  };


  export const getmessages=async(req,res)=>{
    try {
      const roomid = req.params.id; // Get the room ID from the request parameters
  // console.log(roomid,"yttttttttttttttttttttt");
      // Find all messages where roomId matches the specified roomid
      const messages = await Chat.find({ roomId: roomid }).populate('replyId','message');
  
      if (!messages) {
        return res.status(404).json({ message: 'Messages not found' });
      }
  
      return res.status(200).json({status:"true",data:messages});
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

//   export const getMessages = async (req, res) => {
//   try {
//     const roomid = req.params.id; // Get the room ID from the request parameters
//     const { offset, limit } = req.query;

//     // Find chat messages where roomId matches the specified roomid with pagination
//     const messages = await Chat.find({ roomId: roomid })
//       .sort({ timestamp: -1 }) // Sort by timestamp in descending order
//       .skip(parseInt(offset, 10)) // Offset: Number of messages to skip
//       .limit(parseInt(limit, 10)) // Limit: Number of messages to retrieve
//       .exec();

//     if (!messages) {
//       return res.status(404).json({ status: false, message: 'Messages not found' });
//     }

//     return res.status(200).json({ status: true, data: messages });
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     return res.status(500).json({ status: false, message: 'Internal server error' });
//   }
// };





  export const getChattedUsers = async (req, res, next) => {
  
    try {
      // Get the ID of the current user
      const currentUserId = req.userId;
  
      // Create a Set to store unique `sendeduser` IDs
      const uniqueSendedUsers = new Set();
  
      // Create an array to store chatted user details
      const chattedUserDetails = [];
  
      // Find chat messages and populate the `roomId` field
      const chatMessages = await Chat.find().populate('roomId');
  
      for (const message of chatMessages) {
        const room = message.roomId;
        const members = room.members; // Array of user IDs
  
        // Check if the current user's ID is in the room's members
        if (members.some(memberId => memberId.toString() === currentUserId)) {
          // Find the ID of the other user in the room
          const otherUserId = members.find(memberId => memberId.toString() !== currentUserId);
  
          // Check if the other user is unique
          if (!uniqueSendedUsers.has(otherUserId.toString())) {
            // Retrieve user details for the other user
            const otherUser = await User.findById(otherUserId, 'username profilepicture ');
  
            // Add the other user's ID to the Set to mark it as seen
            uniqueSendedUsers.add(otherUserId.toString());
  
            // Add the details to the array
            chattedUserDetails.push({
              roomId: room._id,
              sendeduser: otherUser,
              // latestMessage: message.message,
          // currentUser: currentUser,
            });
          }
        }
      }
  
      res.status(200).json({ status:"true", data: chattedUserDetails });
    } catch (error) {
      console.error('Error fetching chatted users:', error);
      next(error);
    }
  };
  

  export const deleteMessage = async (req, res) => {
    try {
      const messageId = req.params.id;
      // Use Mongoose to find and delete the message by its _id
      
      const deletedMessage = await Chat.findByIdAndRemove(messageId);
  
      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting the message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



  export const addmessage=async(req,res,next)=>{
    try {
      // Extract data from the request body (assuming it's in JSON format)
      const { senderId, message, roomId, replyId } = req.body;
      // Create a new Chat document using the Chat model
      const chatMessage = new Chat({
        senderId, // Convert senderId to ObjectId
        message,
        roomId, // Convert roomId to ObjectId
        replyId: replyId ? replyId : null, // Convert replyId to ObjectId or set to null if not provided
      });
      // Save the chat message to the database
      await chatMessage.save();
      if (replyId) {
           await chatMessage.populate('replyId','message');
        //    chatMessage.replyId = {
        //        message: chatMessage.replyId.message,
        //       //  replyId:chatMessage.replyId._id
        //  }
        }
      res.status(201).json({ status: 'true', chatMessage });
    } catch (error) {
      console.error(error);
     next(error)
    }
  
  }



  export const messagedeleteforme=async(req,res,next)=>{
    const userId=req.userId
    const messageId = req.params.id
    
  
    try {
      // Check if the message with messageId exists
      const message = await Chat.findById(messageId);
  
      if (!message) {
        throw new AppError("Message not found", 404);
      }

      
    // Check if userId is already in the deleteduser array
    if (message.deleteduser.includes(userId)) {
      return res.status(200).json({ status: "fail", message: 'Message already deleted' });
    }
  
      // Update the Chat document to push the messageId to the deleteduser array
      await Chat.findByIdAndUpdate(
        messageId,
        { $push: { deleteduser: userId } },
        { new: true } // Ensure you get the updated document as a result
      );

      res.status(200).json({status:"true", message: 'Message deleted successfully' });
    } catch (error) {
      console.error(error);
     next(error)
    }
  }


  export const deleteforeveryone = async (req, res,next) => {
    const userId=req.userId
    const messageId = req.params.id
    try {
      // Check if the message with messageId exists
      const message = await Chat.findById(messageId);
      if (!message) {
        throw new AppError("Message not found", 404);
      }
  
      // Check if the user trying to delete the message is the sender
      if (message.senderId.toString() !== userId) {
        throw new AppError("You are not authorized to delete this message", 403);
      }
  
      // Delete the message for everyone in the room
      await Chat.deleteOne({ _id: messageId });
  
      res.status(200).json({ status: "true", message: 'Message deleted for everyone' });
    } catch (error) {
      console.error(error);
      next(error)
    }
  };




  export const chattedrooms = async (req, res,next) => {
    try {
      // Query the Room model to get a list of chat rooms
      // const chatRooms = await Room.find({ latestmessage: { $ne: null } }).populate('latestmessage');
      const chatRooms = await Room.find({ latestmessage: { $ne: null } }).populate([
        {
          path: 'members',
          model: 'User',
          select: 'username profilepicture',
        },
        {
          path: 'latestmessage',
          model: 'Chat',
     
        },
      ]);
      
      chatRooms.forEach((room) => {
        if (room.members.length > 0) {
          room.members.pop(); // Remove the last element from the members array
        }
      });


      res.status(200).json({status:"true",data:chatRooms });
    } catch (error) {
      console.error(error);
    next(error)
    }
  };



  export const clearchat=async(req,res,next)=>{
    const userId=req.userId
    const roomId=req.params.id
    try {
      // Find the chat messages for the specified room and user
      const messages = await Chat.find({ roomId });
      if (messages.length === 0) {
        // If there are no matching messages, return a response or an error
        throw new AppError("No messages found to clear",200)
      }
  
       // Update the `deleteduser` array for each message in the room
    messages.forEach(async (message) => {
      // Check if userId is not already in the `deleteduser` array
      if (!message.deleteduser.includes(userId)) {
        message.deleteduser.push(userId);
        await message.save();
      }
    });
  
      return res.status(200).json({status:"true", message: 'Chat cleared successfully' });
    } catch (error) {
      // Handle errors appropriately
      console.error('Error clearing chat:', error);
      next(error)
    }
  }


