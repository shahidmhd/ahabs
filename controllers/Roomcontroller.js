import Room from "../Models/Roommodel.js";
import Chat from "../Models/Chatsamplemodel.js";
import User from "../Models/Usermodel.js"



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
      const messages = await Chat.find({ roomId: roomid });
  
      if (!messages) {
        return res.status(404).json({ message: 'Messages not found' });
      }
  
      return res.status(200).json({status:"true",data:messages});
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }





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
  