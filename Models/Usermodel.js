import mongoose from 'mongoose';
import validator from 'validator';

const validGenders = ['male', 'female', 'other'];

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    validate: {
      validator: (value) => {
        // Use validator functions to validate phone numbers
        return validator.isMobilePhone(value, 'any', { strictMode: false });
      },
      message: 'Invalid phone number format',
    },
  },
  email: {
    type: String,
    validate: {
      validator: (value) => {
        // Use validator functions to validate email addresses
        return validator.isEmail(value);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,

  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Username must be at least 5 characters long'],
  },
  gender: {
    type: String,
    enum: validGenders,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // This sets up a reference to the User model for each follower
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // This sets up a reference to the User model for each following user
    },
  ],
  verified: {
    type: Boolean,
    default: false, // Default value is set to false
  },
  isblocked: {
    type: Boolean,
    default: false, // Default value is set to false
  },
  Bio: {
    type: String,
  },
  profilepicture: {
    type: String,
    default: 'https://res-console.cloudinary.com/dxe7xokgr/thumbnails/v1/image/upload/v1696574351/MjI1LWRlZmF1bHQtYXZhdGFyX3F6emx3eA==/grid_landscape', // Replace with the actual path or URL of your default profile picture
  },
  
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;



//   old schema--------------------------------

// import mongoose from "mongoose";

// // Define the possible gender options
// const validGenders = ['male', 'female', 'other'];

// // Define a Mongoose schema for Users
// const userSchema = new mongoose.Schema({
//     phone: {
//         type: String,
//     },
//     email: {
//         type: String,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     gender: {
//         type: String,
//         enum: validGenders,
//         required: true,
//     },
//     dateOfBirth: {
//         type: Date,
//         required: true,
//     },
// }, {
//     timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
// });

// // Create a Mongoose model for the 'User' collection
// const User = mongoose.model('User', userSchema);

// // Export the 'User' model
// export default User;

