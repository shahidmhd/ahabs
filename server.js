// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import dbConfig from './config/databasemongo.js'
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import http from 'http'; // Import the http module for Socket.io
import { Server } from 'socket.io'; // Import the Server class from Socket.io
import Authrouter from './Routes/Authroutes.js';
import userRouter from './Routes/userRoutes.js'
import errorHandlingMiddleware from './middlewear/errorhandlingmiddlewear.js';
// Load environment variables from a .env file
dotenv.config();

// Create an Express application instance
const app = express();
const server = http.createServer(app); // Create an HTTP server using your Express app
// Define the port to listen on, using the PORT environment variable
const port = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined in .env


// Create a Socket.io server and attach it to the HTTP server
// const io = new Server(server);
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend app's URL
  }
});

if(process.env.NODE_ENV==="development"){
  app.use(morgan('dev')); // Logging middleware
}
// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }))
// app.use(morgan('dev')); // Logging middleware
app.use(helmet()); // Helmet for security headers
app.use(cors())


// Connect to MongoDB
dbConfig(); // Call the connectDB function



// Define a route that responds with "Hello World!" for the root URL
app.use('/api/auth',Authrouter)
app.use('/api/user',userRouter)




// // Error handling middleware for undefined routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status ="fail";
  next(error);
});

app.use(errorHandlingMiddleware)
// Socket.io connection
// Store online users
const onlineUsers = new Set();

io.on('connection', (socket) => {
  console.log("socket connected");
  console.log(`User connected with socket.id: ${socket.id}`);
  onlineUsers.add(socket.id);

  // Notify everyone when a user joins
  socket.broadcast.emit('user-joined', socket.id);

  // Listen for chat messages
  socket.on('chat-message', (message) => {
    // Broadcast the message to all connected users
    io.emit('chat-message', { id: socket.id, message });
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected with socket.id: ${socket.id}`);
    onlineUsers.delete(socket.id);
    // Notify everyone when a user leaves
    socket.broadcast.emit('user-left', socket.id);
  });
});


// Start the server and log a message when it starts listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});