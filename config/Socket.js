// import User from "../Models/Usermodel.js";
import Room from "../Models/Roommodel.js";
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
      const {receiver} = notification;
            const user = activeUsers.find((user) => user.userId === receiver);
            if(user){
                io.to(user.socketId).emit('receive-notification',notification)
            }
      // Here, you can process the notification data and decide to whom and how to send it
      // For example, you might want to send it to specific users or to all connected clients
      // io.emit('receive-notification', notification); // Broadcast the notification to all connected clients
    });
  
    // socket.on('chat-message', async (message) => {
    //   console.log(message, 'Received chat message from client');
    //   const { to } = message;
    //   // Assuming you have a ChatMessage model
    //   const chatMessage = new ChatMessage({
    //     senderId: message.userId,
    //     message: message.message,
    //     roomId: message.roomid,
    //     ...(message.replyId && { replyId: message.replyId }),
    //   });

    //   try {

    //     console.log(chatMessage,"uuuuuurrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    //     const savedMessage = await chatMessage.save();
    //     console.log('Message saved to the database:', savedMessage);
    //     if (message.replyId) {
    //       await savedMessage.populate('replyId', 'message');
    //       savedMessage.replyId = {
    //         replyId: savedMessage.replyId._id,
    //         message: savedMessage.replyId.message,
    //       };
    //       console.log(savedMessage, "ttttttttttttttttttttttttttttttttttttttttttttttttttttt");
    //     }
      
    //   //  socket.broadcast.emit('chat-message',savedMessage);
    //    const user = onlineUsers.find((user) => user.userId === to);
    //    if (user) {
    //      io.to(user.socketId).emit("chat-message", savedMessage);
    //    }
    //     // Broadcast the message to other users in the room

    //     // io.to(message.roomid).emit('chat-message',savedMessage);
    //   } catch (error) {
    //     console.error('Error saving message to the database:', error);
    //   }
    // });


    // -----------------------------------//
    socket.on('chat-message', async (message) => {
      const { to} = message;
      console.log(message, 'Received chat message from client');
      const user = onlineUsers.find((user) => user.userId === to);
       if (user) {
         io.to(user.socketId).emit("chat-message", message);
       }
    });

    // -----------------------------------//
       



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



// import ChatMessage from "../Models/Chatsamplemodel.js";
// import path from 'path';

// import { AWS, s3 } from './Awss3.js'
// const onlineUsers = new Set();
// import upload from './multerconfig.js'

// const bucketName = 'shahidbucketsample';

// const initializeSocketIO = (io) => {
//   io.on('connection', (socket) => {
//     console.log('User connected with socket.id:', socket.id);
//     onlineUsers.add(socket.id);

//     socket.broadcast.emit('user-joined', socket.id);
//     console.log(onlineUsers);

//     socket.on('chat-message', async (message) => {
//       console.log(message, 'Received chat message from client');

//       // const chatMessage = new ChatMessage({
//       //   senderId: message.userId,
//       //   message: message.message,
//       //   roomId: message.roomid,
//       // });


//       // if (message.image) {
//       //   try {
//       //     const imageFile = message.image;
//       //     const imageFileName = `${Date.now()}-${path.basename(imageFile.name)}`;
//       //     const imageUploadPath = path.join(__dirname, 'path/to/your/upload/folder', imageFileName);

//       //     // Move the image file to the specified path
//       //     await imageFile.mv(imageUploadPath);

//       //     // Upload the image to S3
//       //     const params = {
//       //       Bucket: bucketName,
//       //       Key: imageFileName,
//       //       Body: require('fs').createReadStream(imageUploadPath),
//       //     };

//       //     s3.upload(params, (err, data) => {
//       //       if (err) {
//       //         console.error('Error uploading image to S3:', err);
//       //       } else {
//       //         // Set the image URL in the chat message as the S3 URL
//       //         chatMessage.image = data.Location;

//       //         // Save the chat message to the database
//       //         chatMessage.save()
//       //           .then((savedMessage) => {
//       //             console.log('Message saved to the database:', savedMessage);

//       //             // Emit the saved message (including image URL) back to the sender
//       //             socket.emit('chat-message', savedMessage);

//       //             // Broadcast the message (including image URL) to other users in the room
//       //             socket.to(message.roomid).emit('chat-message', savedMessage);
//       //           })
//       //           .catch((error) => {
//       //             console.error('Error saving message to the database:', error);
//       //           });
//       //       }
//       //     });
//       //   } catch (error) {
//       //     console.error('Error saving image:', error);
//       //   }
//       // }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected with socket.id:', socket.id);
//       onlineUsers.delete(socket.id);
//       socket.broadcast.emit('user-left', socket.id);
//     });
//   });
// };

// export default initializeSocketIO;
