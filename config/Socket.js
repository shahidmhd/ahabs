import ChatMessage  from "../Models/Chatsamplemodel.js";
let onlineUsers = [];


const initializeSocketIO = (io) => {
  io.on('connection',async (socket) => {
    console.log('User connected with socket.id:', socket.id);
    // onlineUsers.add(socket.id);
  
    socket.broadcast.emit('user-joined', socket.id);



    // Handle 'new-user-add' event to add a new user
    socket.on('new-user-add', (userId) => {
      onlineUsers.push({ socketId: socket.id, userId });
      console.log(onlineUsers);
      io.emit('get-users', onlineUsers);
    });

  //    //add new user
  //    socket.on('new-user-add',(userId)=>{
  //     console.log(userId,"sssssssssssssssssssssssssssss");
  //     // if(!activeUsers.some((user)=>user?.userId ===userId)){
  //     //     activeUsers.push({
  //     //         userId:userId,
  //     //         socketId:socket.id
  //     //     })
  //     // }
  //     // io.emit('get-users',activeUsers)
  // })


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

       socket.broadcast.emit('chat-message',savedMessage);

        // Broadcast the message to other users in the room

        // io.to(message.roomid).emit('chat-message',savedMessage);
      } catch (error) {
        console.error('Error saving message to the database:', error);
      }
    });

    // socket.on('disconnect', () => {
    //   console.log('User disconnected with socket.id:', socket.id);
    //   onlineUsers.delete(socket.id);
    //   socket.broadcast.emit('user-left', socket.id);
    // });

      // Handle 'disconnect' event to remove the user on disconnect
      // Handle 'disconnect' event to remove the user on disconnect
      socket.on('disconnect', () => {
        console.log('User disconnected with socket.id:', socket.id);
  
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
  console.log(onlineUsers);
        io.emit('get-users', onlineUsers);
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
