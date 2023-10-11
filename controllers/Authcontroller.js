// Import your User model
import User from '../Models/Usermodel.js'; // Update the path as needed
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwtcreation.js';
import nodemailer from 'nodemailer'
import AppError from '../utils/AppError.js'
import VerificationRecord from '../Models/verificationmodel.js';
// Schedule the job to run every hour (you can adjust the schedule as needed)
import cron from 'node-cron'

// Create a Nodemailer transporter using your email service provider's credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'afsal4771@gmail.com',
    pass: 'svbo fxkj gzip obqd',

  },
});


export const RegisterUser = async (req, res, next) => {
  try {
    // Extract user registration data from the request body
    const { email, phone, password, username, gender, dateOfBirth } = req.body;
    // Check if an email is provided
    // Check if neither email nor phone is provided
    if (!email && !phone) {
      // return res.status(400).json({ message: 'Email or phone is required' });
      // throw new AppError('Email or phone is required', 400);
      throw new AppError('Email or phone is required', 400)
    }

    if (email) {
      // Check if the email already exists in the database
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        // return res.status(409).json({ message: 'Email already exists' });
        throw new AppError('Email already exists', 409)
      }
    }

    if (phone) {
      // Check if the phone number already exists in the database
      const existingPhoneUser = await User.findOne({ phone });
      if (existingPhoneUser) {
        // return res.status(409).json({ message: 'Phone number already exists'});
        throw new AppError('Phone number already exists', 409)
      }
    }
    if (username) {
      // Check if the phone number already exists in the database
      const existingusername = await User.findOne({ username });
      if (existingusername) {
        // return res.status(409).json({ message: 'username already exists' });
        throw new AppError('username already exists', 409)

      }
    }
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      email,
      phone,
      username,
      password: hashedPassword,
      gender,
      dateOfBirth,
    });

    // Save the user to the database
    await newUser.save();

    // Create a JWT token for the newly registered user
    const token = generateToken(newUser._id)
    // Return the token as a response
    res.status(201).json({ status: 'true',userId:newUser._id, message: 'User registered successfully', token });
  } catch (error) {
    // console.error('Registration error:', error);
    // res.status(500).json({ message: 'An error occurred during registration.' });
    // throw new AppError('Email or phone is required', 400);
    next(error)

  }
}

export const userlogin = async (req, res, next) => {

  try {
    // Extract user login data from the request body
    const { identifier, password } = req.body;

    // Check if either identifier or password is missing
    if (!identifier || !password) {
      // return res.status(400).json({ message: 'Email or password are required' });
      throw new AppError('Email or password are required', 400)
    }

    let user;

    // Check if the provided identifier is in email format
    if (identifier.includes('@')) {
      // If it's an email, find the user by email
      user = await User.findOne({ email: identifier });
    } else {
      // If it's not an email, assume it's a phone number and find the user by phone
      user = await User.findOne({ phone: identifier });
    }
    // Check if the user exists
    if (!user) {
      // return res.status(404).json({ message: 'User not found' });
      throw new AppError('User not found', 400)
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // return res.status(401).json({ message: 'Invalid password' });
      throw new AppError('Invalid password', 401)
    }

    // Generate a JWT token for the authenticated user
    const token = generateToken(user._id);

    // Return the token as a response
    res.status(200).json({ status: 'true',userId:user._id, message: 'Login successful', token });
  } catch (error) {
    // console.error('Login error:', error);
    // res.status(500).json({ message: 'An error occurred during login.' });
    next(error)
  }
}




export const emailverification = async (req, res, next) => {
  try {
    // Extract the user's email from the request body
    const { email } = req.body;

    // Check if there's an existing verification record for the email
    let verificationRecord = await VerificationRecord.findOne({ email });

    if (!verificationRecord) {
      // If there's no existing record, create a new one
      verificationRecord = new VerificationRecord({ email });
    }

    // Generate a new random 6-digit verification code
    const newVerificationCode = generateRandomCode();

    // Calculate the expiration time (5 minutes from the current time)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds

    // Update the verification record with the new code and expiration time
    verificationRecord.code = newVerificationCode;
    verificationRecord.expiresAt = expirationTime;

    // Save the updated or new verification record to your database
    await verificationRecord.save();

    // Create the email message with the verification code
    const emailMessage = `Your verification code is: ${newVerificationCode}\n\nThis code is valid for 5 minutes.`;

    // Send the email with the verification code
    const mailOptions = {
      from: 'afsal4771@gmail.com',
      to: email,
      subject: 'Email Verification Code',
      text: emailMessage,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ status: 'true', message: 'Email verification code sent successfully' });
  } catch (error) {
    next(error);
  }
};



// Function to generate a random code of the specified length
// Function to generate a random 6-digit code
function generateRandomCode() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}



// Function to delete expired verification records
const deleteExpiredVerificationRecords = async () => {
  try {
    const now = new Date();
    await VerificationRecord.deleteMany({ expiresAt: { $lt: now } });
  } catch (error) {
    console.error('Error deleting expired verification records:', error);
  }
};

// cron.schedule('0 * * * *', deleteExpiredVerificationRecords);

// Schedule the job to run every 1 minute
// cron.schedule('* * * * *', deleteExpiredVerificationRecords);
// Schedule the job to run every 5 minutes
// cron.schedule('*/5 * * * *', deleteExpiredVerificationRecords);
// Schedule the job to run every day at a specific time (e.g., 3:00 AM)
cron.schedule('0 3 * * *', deleteExpiredVerificationRecords);
// Schedule the job to run on the 1st day of every month at a specific time (e.g., 3:00 AM)
// cron.schedule('0 3 1 * *', deleteExpiredVerificationRecords);
// Schedule the job to run on a specific date and time every year (e.g., January 1st at 3:00 AM)
// cron.schedule('0 3 1 1 *', deleteExpiredVerificationRecords);




// verificationController.js
export const verifyEmail = async (req, res, next) => {
  try {
    // Extract email and code from the request body
    const { email, code } = req.body;

    // Find the verification record in the database
    const verificationRecord = await VerificationRecord.findOne({ email, code });

    if (!verificationRecord) {
      // Record not found or expired
      // throw new AppError('Invalid verification code', 404);
      return res.status(404).json({ status: "fail", message: 'Invalid verification code' });
    }

    // Check if the verification code is still valid (not expired)
    const currentTime = new Date();
    if (verificationRecord.expiresAt <= currentTime) {
      // Code has expired
      // throw new AppError('Verification code has expired', 400);
      return res.status(400).json({ status: "fail", message: 'Verification code has expired' });
    }

    // Mark the email as verified (update your user's document in the database here)
    // Add your logic here to mark the user's email as verified in your database
    // Example: user.emailVerified = true; await user.save();

    // Delete the verification record from the database
    await VerificationRecord.deleteOne({ email, code });

    // Respond with a success message
    return res.status(200).json({ status: 'true', message: 'Email verification successful' });
  } catch (error) {
    next(error);
  }
};


