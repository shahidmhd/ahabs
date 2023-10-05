import mongoose from "mongoose";

// Define the possible gender options
const validGenders = ['male', 'female', 'other'];

// Define a Mongoose schema for Users
const userSchema = new mongoose.Schema({
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
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
}, {
    timestamps: true, // This option adds 'createdAt' and 'updatedAt' fields
});

// Create a Mongoose model for the 'User' collection
const User = mongoose.model('User', userSchema);

// Export the 'User' model
export default User;

