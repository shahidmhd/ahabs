// Import your User model
import User from '../Models/Usermodel.js'; // Update the path as needed
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwtcreation.js';
import nodemailer from 'nodemailer'
import AppError from '../utils/AppError.js';

// Create a Nodemailer transporter using your email service provider's credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
  auth: {
    user: 'afsal4771@gmail.com',
    pass: 'svbo fxkj gzip obqd',

  },
});


export const RegisterUser = async (req, res) => {
  try {
    // Extract user registration data from the request body
    const { email, phone, password,username, gender, dateOfBirth } = req.body;
    // Check if an email is provided
    // Check if neither email nor phone is provided
    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
      // throw new AppError('Email or phone is required', 400);
    }

    if (email) {
      // Check if the email already exists in the database
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }
    }

    if (phone) {
      // Check if the phone number already exists in the database
      const existingPhoneUser = await User.findOne({ phone });
      if (existingPhoneUser) {
        return res.status(409).json({ message: 'Phone number already exists'});
      }
    }
    if (username) {
      // Check if the phone number already exists in the database
      const existingusername = await User.findOne({ username });
      if (existingusername) {
        return res.status(409).json({ message: 'username already exists' });
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
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
}


export const emailverification = async (req, res) => {

  try {
    // Extract the user's email from the request body
    const { email } = req.body;

    // Generate a random verification code (you can use a library like crypto to create a secure code)
    const verificationCode = '123456'; // Replace with a secure code generation method

    // Replace 'your-localhost-url' with the actual URL of your localhost server
    const localhostURL = process.env.Domain_URL;

    // Create an email verification link with the verification code and route
    const verificationLink = `${localhostURL}/verify?code=${verificationCode}`;


    // Send an email with the verification link
    const mailOptions = {
      from: 'afsal4771@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Click on the following link to verify your email: ${verificationLink}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ message: 'Email verification link sent successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'An error occurred during email verification.' });
  }
}

export const verifyemail = (req, res) => {
  try {
    // Extract the verification code from the query parameters
    const { code } = req.query;

    // Verify the code (you should compare it with the one generated during registration)
    if (code === '123456') {
      // Code is valid, mark the user's email as verified in the database
      // You can update the user's document in the database to set their email as verified
      // Example:
      // const user = await User.findOneAndUpdate({ email: user.email }, { emailVerified: true });

      // Redirect the user to a success page or send a JSON response
      res.status(200).json({ message: 'Email verification successful' });
    } else {
      // Invalid code
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'An error occurred during email verification.' });
  }

}


export const userlogin = async(req,res) => {

  try {
    // Extract user login data from the request body
    const { identifier, password } = req.body;

    // Check if either identifier or password is missing
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email or password are required' });
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
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token for the authenticated user
    const token = generateToken(user._id);

    // Return the token as a response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
}