// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import dbConfig from './config/databasemongo.js'
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import Authrouter from './Routes/Authroutes.js';
import userRouter from './Routes/userRoutes.js'
import errorHandlingMiddleware from './middlewear/errorhandlingmiddlewear.js';
// Load environment variables from a .env file
dotenv.config();

// Create an Express application instance
const app = express();

// Define the port to listen on, using the PORT environment variable
const port = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined in .env


// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev')); // Logging middleware
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


// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);

//     // Set the status code based on the error or default to 500
//     const statusCode = err.status || 500;

//     // Create an error response object
//     const errorResponse = {
//         status: 'error',
//         message: err.message || 'Something went wrong!',
      
//     };
//     // Send the error response as JSON
//     res.status(statusCode).json(errorResponse);
// });


// Start the server and log a message when it starts listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});