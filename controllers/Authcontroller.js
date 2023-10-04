// Import your User model
import User from '../Models/Usermodel.js'; // Update the path as needed
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwtcreation.js';
import nodemailer from 'nodemailer'
import AppError from '../utils/AppError.js'
import VerificationRecord from '../Models/verificationmodel.js';

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
    res.status(201).json({ status: 'true', message: 'User registered successfully', token });
  } catch (error) {
    // console.error('Registration error:', error);
    // res.status(500).json({ message: 'An error occurred during registration.' });
    // throw new AppError('Email or phone is required', 400);
    next(error)

  }
}


// export const emailverification = async (req, res,next) => {

//   try {
//     // Extract the user's email from the request body
//     const { email } = req.body;



//     // Check if the email already exists in the database (replace this with your database query logic)
//     const emailExists = await User.findOne({ email: email });
//     if (emailExists) {
//       // Email already exists in the database, send an error response
//       throw new AppError('Email already exists',409)

//     }
//     // Generate a random verification code (you can use a library like crypto to create a secure code)
//     const verificationCode = 'wxcvxdresdfg4vbnc44vfttrewq7qaggfh9jjjknknhbghffgvbhjg'; // Replace with a secure code generation method

//     // Replace 'your-localhost-url' with the actual URL of your localhost server
//     const localhostURL = process.env.Domain_URL;

//     // Create an email verification link with the verification code and route
//     const verificationLink = `${localhostURL}/verify?code=${verificationCode}`;


//     // Send an email with the verification link
//     const mailOptions = {
//       from: 'afsal4771@gmail.com',
//       to: email,
//       subject: 'Email Verification',
//       text: `Click on the following link to verify your email: ${verificationLink}`,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     // Respond with a success message
//     res.status(200).json({status:'true', message: 'Email verification link sent successfully' });
//   } catch (error) {
//    next(error)
//   }
// }

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

    // Generate a new random verification code
    const newVerificationCode = generateRandomCode(6); // Generates a 6-character random code

    // Calculate the expiration time (5 minutes from the current time)
    const expirationTime = new Date(Date.now() + 5 * 60* 1000); // 5 minutes in milliseconds

    // Update the verification record with the new code and expiration time
    verificationRecord.code = newVerificationCode;
    verificationRecord.expiresAt = expirationTime;

    // Save the updated or new verification record to your database
    await verificationRecord.save();

    // Replace 'your-localhost-url' with the actual URL of your localhost server
    const localhostURL = process.env.Domain_URL;

    // Create an email verification link with the email and new verification code
    const verificationLink = `${localhostURL}/verify?email=${email}&code=${newVerificationCode}`;

    // Send an email with the updated or new verification link
    const mailOptions = {
      from: 'afsal4771@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Click on the following link to verify your email valid up to 5 minutes: ${verificationLink}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ status: 'true', message: 'Email verification link sent successfully' });
  } catch (error) {
    next(error);
  }
};


// Function to generate a random code of the specified length
function generateRandomCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}





// export const verifyemail = (req, res,next) => {
//   try {
//     // Extract the verification code from the query parameters
//     const { code } = req.query;

//     // Verify the code (you should compare it with the one generated during registration)
//     if (code === 'wxcvxdresdfg4vbnc44vfttrewq7qaggfh9jjjknknhbghffgvbhjg') {
//       // Code is valid, mark the user's email as verified in the database
//       // You can update the user's document in the database to set their email as verified
//       // Example:
//       // const user = await User.findOneAndUpdate({ email: user.email }, { emailVerified: true });

//       // Redirect the user to a success page or send a JSON response
//       res.status(200).json({status:'true', message: 'Email verification successful' });
//     } else {
//       // Invalid code
//       // res.status(400).json({ message: 'Invalid verification code' });
//       throw new AppError('Invalid verification code',400)
//     }
//   } catch (error) {
//     // console.error('Email verification error:', error);
//     // res.status(500).json({ message: 'An error occurred during email verification.' });
//     next(error)
//   }

// }

export const verifyemail = async (req, res, next) => {
  try {
    // Extract email and verification code from the query parameters
    const { email, code } = req.query;

    // Find the verification record in the database
    const verificationRecord = await VerificationRecord.findOne({ email, code });

    if (!verificationRecord) {
      // Record not found or expired
      throw new AppError('Invalid verification link', 404)
    }

    // Check if the verification code is still valid (not expired)
    const currentTime = new Date();
    if (verificationRecord.expiresAt <= currentTime) {
      await VerificationRecord.deleteOne({ email, code });
      // Code has expired
      throw new AppError('Verification code has expired',400)
    
    }

    // Mark the email as verified (update your user's document in the database here)

    // Delete the verification record from the database
    await VerificationRecord.deleteOne({ email, code });

    // Respond with a success message
    return res.status(200).json({ status: 'true', message: 'Email verification successful' });
  } catch (error) {
    next(error);
  }
};


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
    res.status(200).json({ status: 'true', message: 'Login successful', token });
  } catch (error) {
    // console.error('Login error:', error);
    // res.status(500).json({ message: 'An error occurred during login.' });
    next(error)
  }
}