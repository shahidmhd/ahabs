import User from '../Models/Usermodel.js'; // Update the path as needed
import bcrypt from 'bcrypt';
import { generateToken} from '../utils/jwtcreation.js';
import nodemailer from 'nodemailer'
import AppError from '../utils/AppError.js'
import VerificationRecord from '../Models/verificationmodel.js';
// Schedule the job to run every hour (you can adjust the schedule as needed)
import cron from 'node-cron'

// Create a Nodemailer transporter using your email service provider's credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'cyenosure@gmail.com',
    pass: 'nmpb phnq dwxy dvzq',

  },
});



// Register api

export const RegisterUser = async (req, res, next) => {
  try {
    const { email, phone, password, username, gender, dateOfBirth } = req.body;

    if (!email && !phone) {
      throw new AppError('Email or phone is required', 400);
    }

    // Use Promise.all for concurrent email and phone existence checks
    const [existingEmailUser, existingPhoneUser, existingUsername] = await Promise.all([
      email ? User.findOne({ email }) : null,
      phone ? User.findOne({ phone }) : null,
      username ? User.findOne({ username }) : null
    ]);

    if (existingEmailUser) {
      throw new AppError('Email already exists', 409);
    }

    if (existingPhoneUser) {
      throw new AppError('Phone number already exists', 409);
    }

    if (existingUsername) {
      throw new AppError('Username already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      phone,
      username,
      password: hashedPassword,
      gender,
      dateOfBirth,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({ status: 'true', userId: newUser._id, message: 'User registered successfully', token });
  } catch (error) {
    next(error);
  }
};

  // Login api

export const userlogin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new AppError('Email or password are required', 400);
    }

    let user;

    // Use Promise.all for concurrent email and phone identification checks
    const [emailUser, phoneUser] = await Promise.all([
      identifier.includes('@') ? User.findOne({ email: identifier }) : null,
      User.findOne({ phone: identifier })
    ]);

    // Choose the user based on the results of email and phone checks
    user = emailUser || phoneUser;

    if (!user) {
      throw new AppError('User not found', 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid password', 401);
    }

    const token = generateToken(user._id);

    res.status(200).json({ status: 'true', userId: user._id, message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};

  // Email verification

export const emailverification = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Use Promise.all for concurrent database queries
    const [existingUser, verificationRecord] = await Promise.all([
      User.findOne({ email }),
      VerificationRecord.findOne({ email })
    ]);

    if (existingUser) {
      // User is already verified
      return res.status(400).json({ status: 'fail', message: 'User is already exist' });
    }

    // If there's no existing verification record, create a new one
    const newVerificationRecord = verificationRecord || new VerificationRecord({ email });

    // Generate a new random 6-digit verification code
    const newVerificationCode = generateRandomCode();

    // Calculate the expiration time (5 minutes from the current time)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds

    // Update the verification record with the new code and expiration time
    newVerificationRecord.code = newVerificationCode;
    newVerificationRecord.expiresAt = expirationTime;

    // Save the updated or new verification record to your database
    await newVerificationRecord.save();

    // Create the email message with the verification code
    const emailMessage = `Your verification code is: ${newVerificationCode}\n\nThis code is valid for 5 minutes.`;

    // Send the email with the verification code
    const mailOptions = {
      from: 'cyenosure@gmail.com',
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

   // Function to generate a random 6-digit code

    function generateRandomCode() {
      const min = 100000; // Minimum 6-digit number
      const max = 999999; // Maximum 6-digit number
      return String(Math.floor(Math.random() * (max - min + 1)) + min);
    }



  // Email verification api

export const verifyEmail = async (req, res, next) => {
  try {
    // Extract email and code from the request body
    const { email, code } = req.body;

    // Find the verification record and user in the database concurrently
    const [verificationRecord, user] = await Promise.all([
      VerificationRecord.findOne({ email, code }),
      User.findOne({ email })
    ]);

    if (!verificationRecord) {
      // Record not found or expired
      return res.status(404).json({ status: 'fail', message: 'Invalid verification code' });
    }

    // Check if the verification code is still valid (not expired)
    const currentTime = new Date();
    if (verificationRecord.expiresAt <= currentTime) {
      // Code has expired
      return res.status(400).json({ status: 'fail', message: 'Verification code has expired' });
    }

    if (!user) {
      // User not found
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Update the user's "emailVerified" field to true and delete the verification record
    await Promise.all([
      User.updateOne({ email }, { verified: true }),
      VerificationRecord.deleteOne({ email, code })
    ]);

    // Respond with a success message
    return res.status(200).json({ status: 'true', message: 'Email verification successful' });
  } catch (error) {
    next(error);
  }
};

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
