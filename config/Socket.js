import ChatMessage  from "../Models/Chatsamplemodel.js";

const onlineUsers = new Set();

const initializeSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected with socket.id:', socket.id);
    onlineUsers.add(socket.id);

    socket.broadcast.emit('user-joined', socket.id);
    console.log(onlineUsers);

    socket.on('chat-message', async (message) => {
      console.log(message, 'Received chat message from client');

      // Assuming you have a ChatMessage model
      const chatMessage = new ChatMessage({
        senderId: message.userId,
        message: message.message,
        roomId: message.roomid,
      });

      try {
        const savedMessage = await chatMessage.save();
        console.log('Message saved to the database:', savedMessage);

        // Emit the saved message back to the sender
        // socket.emit('chat-message', {
        //   message: savedMessage.message,
        //   userId: savedMessage.senderId.toString(), // Convert senderId to a string
        //   timestamp: savedMessage.timestamp,
        // });

        socket.emit('chat-message',savedMessage);

        // Broadcast the message to other users in the room
        // socket.to(message.roomid).emit('chat-message', {
        //   savedMessage,
        //   message: savedMessage.message,
        
        // });
      } catch (error) {
        console.error('Error saving message to the database:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected with socket.id:', socket.id);
      onlineUsers.delete(socket.id);
      socket.broadcast.emit('user-left', socket.id);
    });
  });
};

export default initializeSocketIO;
