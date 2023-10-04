// Import your User model
import User from '../Models/Usermodel.js'; // Update the path as needed
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwtcreation.js';
import nodemailer from 'nodemailer'
// Create a Nodemailer transporter using your email service provider's credentials
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'Yahoo', etc.
    auth: {
      user: 'afsal4771@gmail.com',
      pass: 'svbo fxkj gzip obqd',
     
    },
  });

  
export const RegisterUser=async(req,res)=>{
    try {
        // Extract user registration data from the request body
        const { email, phone, password, gender, dateOfBirth } = req.body;
        // Check if an email is provided
        // Check if neither email nor phone is provided
        if (!email && !phone) {
            return res.status(400).json({ message: 'Email or phone is required' });
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
                return res.status(409).json({ message: 'Phone number already exists' });
            }
        }
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = new User({
            email,
            phone,
            password: hashedPassword,
            gender,
            dateOfBirth,
        });

        // Save the user to the database
        await newUser.save();

        // Create a JWT token for the newly registered user
        const token =generateToken(newUser._id)

        // Return the token as a response
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
}


export const emailverification=async(req,res)=>{
    console.log(req.body);
    try {
        // Extract the user's email from the request body
        const { email } = req.body;
    
        // Generate a random verification code (you can use a library like crypto to create a secure code)
        const verificationCode = '123456'; // Replace with a secure code generation method
    
        // Create an email verification link with the verification code
        const verificationLink = `https://your-app-url/verify?code=${verificationCode}`;
    
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