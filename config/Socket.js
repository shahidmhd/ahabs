
let onlineUsers = [];


const initializeSocketIO = (io) => {
  io.on('connection',async (socket) => {
    console.log('User connected with socket.id:', socket.id);
    // onlineUsers.add(socket.id);
    // const userId=socket.handshake.query.userId
    // await User.findByIdAndUpdate({_id:userId},{$set:{online:true}})
  // console.log(userId,"uuuuu");
    socket.broadcast.emit('user-joined', socket.id);



    // Handle 'new-user-add' event to add a new user
    socket.on('new-user-add', (userId) => {
      const isUserOnline = onlineUsers.some((user) => user.userId === userId);
      if (!isUserOnline) {
        onlineUsers.push({ socketId: socket.id, userId });
        console.log(onlineUsers);
        io.emit('get-users', onlineUsers);
      }
    });


    socket.on('send-notification', (notification) => {
      console.log(notification,"notification");
      const {receiver} = notification;
            const user = onlineUsers.find((user) => user.userId === receiver);
            if(user){
                io.to(user.socketId).emit('receive-notification',notification)
            }
    });
  
  
    socket.on('chat-message', async (message) => {
      const { to} = message;
      console.log(message, 'Received chat message from client');
      const user = onlineUsers.find((user) => user.userId === to);
       if (user) {
         io.to(user.socketId).emit("chat-message", message);
       }
    });



    socket.on('delete-for-everyone', (data) => {
      console.log(data,"data");
      const {receiverId} = data;
            const user = onlineUsers.find((user) => user.userId === receiverId);
            if(user){
                io.to(user.socketId).emit('delete-for-everyone',data)
           }
    });

      // Handle 'disconnect' event to remove the user on disconnect
      socket.on('disconnect',async () => {
        console.log('User disconnected with socket.id:', socket.id);
        
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
         console.log(onlineUsers);
        io.emit('get-users', onlineUsers);
        // await User.findByIdAndUpdate({_id:userId},{$set:{online:false}})
      });
  });
};

export default initializeSocketIO;

