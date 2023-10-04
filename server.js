// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import dbConfig from './config/databasemongo.js'
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors'
import Authrouter from './Routes/Authroutes.js';
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
app.use('/auth',Authrouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

// Start the server and log a message when it starts listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});