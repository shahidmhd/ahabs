// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import dbConfig from './config/databasemongo.js'
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import initializeSocketIO  from './config/Socket.js'
import http from 'http'; // Import the http module for Socket.io
import { Server } from 'socket.io'; // Import the Server class from Socket.io
import Authrouter from './Routes/Authroutes.js';
import userRouter from './Routes/userRoutes.js'
import ChatRouter from './Routes/Rommroutes.js'
import NotificationRouter from './Routes/NotificationRoutes.js'
import GroupRouter from './Routes/Gropchat.js'
import EducationRouter from './Routes/Educatioroutes.js'
import WorkRouter from './Routes/Workroutes.js'
import Profiledetail from './Routes/Profiledetailroutes.js'
import Defaultdetail from './Routes/Defaultrotes.js'
import relationship from './Routes/Familyroutes.js'
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
initializeSocketIO(io);




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
app.use('/api/chat',ChatRouter)
app.use('/api/notification',NotificationRouter)
app.use('/api/group',GroupRouter)
app.use('/api/education',EducationRouter)
app.use('/api/work',WorkRouter)
app.use('/api/profiledetail',Profiledetail)
app.use('/api/default',Defaultdetail)
app.use('/api/relationship',relationship)



// // Error handling middleware for undefined routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status ="fail";
  next(error);
});

app.use(errorHandlingMiddleware)



// Graceful Shutdown
const handleExit = () => {
  console.log('Server is shutting down...');
  server.close(() => {
    console.log('Server has gracefully stopped.');
    process.exit(0);
  });
};

process.on('SIGINT', handleExit); // Handle Ctrl + C
process.on('SIGTERM', handleExit); // Handle termination signal
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  handleExit();
});




// Start the server and log a message when it starts listening
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});