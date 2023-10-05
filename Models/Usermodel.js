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
    minlength: [6, 'Username must be at least 6 characters long'],
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
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
