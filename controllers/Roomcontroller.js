import Room from "../Models/Roommodel.js";
import Chat from "../Models/chatmodel.js";


export const createuseroom = async (req, res, next) => {
    try {
      const selectedUserId = req.params.id;
      const createdByUserId = req.userId;
  
      // Check if a room with the same members exists
      const existingRoom = await Room.findOne({
        $and: [
          { 'members.user': selectedUserId },
          { 'members.user': createdByUserId },
        ],
      });
      // $and: [
      //   { 'members.user': { $all: [selectedUserId, createdByUserId, ...otherUserIds] },
      // ],
      if (existingRoom) {
        // If a room with the same members exists, return the existing room
        return res.status(200).json(existingRoom);
      }
      const newRoomName = `Room_${Date.now()}`;
      // Create a new room
      const newRoom = new Room({
        name: newRoomName,
        createdBy: createdByUserId,
        members: [
          {
            user: selectedUserId,
          },
          {
            user: createdByUserId,
          },
        ],
      });
  
      const room = await newRoom.save();
      console.log('Room created:', room);
      res.status(201).json(room);
    } catch (err) {
      console.error('Error creating or checking the room:', err);
      next(err);
    }
  };


  export const getmessages=async(req,res)=>{
    try {
      const roomid = req.params.id; // Get the room ID from the request parameters
  console.log(roomid,"yttttttttttttttttttttt");
      // Find all messages where roomId matches the specified roomid
      const messages = await Chat.find({ roomId: roomid });
  
      if (!messages) {
        return res.status(404).json({ message: 'Messages not found' });
      }
  
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }