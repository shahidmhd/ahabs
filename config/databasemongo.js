// db/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // ANSI escape code for yellow color (33m) followed by a reset code (0m)
    console.log('\x1b[33mDatabase connected successfully\x1b[0m');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;