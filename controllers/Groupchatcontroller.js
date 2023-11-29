import Group from "../Models/Groupmodel.js"
import AppError from "../utils/AppError.js";
import Groupmessage from "../Models/Groupmessageschema.js"

//  send group message

export const addmessage = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const currentUserId = req.userId;
    const { message, replyId } = req.body;

    // Check if the group exists
    const groupPromise = Group.findById(groupId);

    // Check if the current user is already a participant in the group
    const participantPromise = Group.exists({ _id: groupId, participants: currentUserId });

    // Wait for both promises to resolve
    const [group, isParticipant] = await Promise.all([groupPromise, participantPromise]);

    if (!group) {
      throw new AppError("Group not found", 404);
    }

    if (!isParticipant) {
      throw new AppError("You are not a participant in this group", 400);
    }

    // Create a new instance of the Chat model
    const newMessage = new Groupmessage({
      senderId: currentUserId,
      message,
      groupId,
      replyId,
    });

    // Save the new message and update the group's latest message in parallel
    const [savedMessage] = await Promise.all([newMessage.save(), Group.findOneAndUpdate(
      { _id: groupId },
      { $set: { latestmessage: newMessage._id } },
      { new: true } // Return the updated document
    )]);

    // Respond with the saved message
    res.status(201).json({ status: "true", message: 'Message sent successfully', data: savedMessage });
  } catch (error) {
    // Handle errors
    console.error(error);
    next(error);
  }
};


    // delete for me 

    export const messagedeleteforme = async (req, res, next) => {
      const userId = req.userId;
      const messageId = req.params.id;
    
      try {
        // Update the Chat document to push the messageId to the deleteduser array
        const updatedMessage = await Groupmessage.findOneAndUpdate(
          { _id: messageId, deleteduser: { $nin: [userId] } },
          { $push: { deleteduser: userId } },
          { new: true }
        );
    
        if (!updatedMessage) {
          return res.status(200).json({ status: "fail", message: 'Message already deleted or not found' });
        }
    
        res.status(200).json({ status: "true", message: 'Message deleted successfully' });
      } catch (error) {
        console.error(error);
        next(error);
      }
    };


      // delete for everyone

      export const deleteforeveryone = async (req, res,next) => {
        const userId=req.userId
        const messageId = req.params.id
        try {
          // Check if the message with messageId exists
          const message = await Groupmessage.findById(messageId);
          if (!message) {
            throw new AppError("Message not found", 404);
          }
          // Check if the user trying to delete the message is the sender
          if (message.senderId.toString() !== userId) {
            throw new AppError("You are not authorized to delete this message", 403);
          }
    
            // Update the message's deleted field to true
          await Groupmessage.updateOne({ _id: messageId }, { $set: { deleted: true } });
    
        //     // update the latest message
        //   const latestMessage = await Chat.findOne({ roomId:message.roomId }) .sort({ createdAt: -1 }).limit(1);
        //   if (latestMessage) { 
        //     const room = await Room.findOne({ _id:message.roomId });
        //     if (room) { 
        //      room.latestmessage =latestMessage. _id;
        //         await room.save(); // Save the updated Room document
        //     }
        //   }
          res.status(200).json({ status: "true", message: 'Message deleted for everyone' });
        } catch (error) {
          console.error(error);
          next(error)
        }
      };


    
    export const getmessages=async(req,res)=>{
        try {
          const groupid = req.params.id; // Get the room ID from the request parameters
          // Find all messages where roomId matches the specified roomid
          const messages = await Groupmessage.find({ groupId: groupid, deleted: { $ne: true } }).populate('replyId','message');
      
          if (!messages) {
            return res.status(404).json({ message: 'Messages not found' });
          }
      
          return res.status(200).json({status:"true",data:messages});
        } catch (error) {
          console.error('Error fetching messages:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
    }

    