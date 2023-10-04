import User from '../Models/Usermodel.js'; // Import your User model (adjust the import path as needed)
import { AWS, s3 } from '../config/Awss3.js'
import AppError from '../utils/AppError.js';

export const getAllUsers = async (req, res, next) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return the users as a JSON response
    res.status(200).json({ success: 'true', count: users.length, data: users });
  } catch (error) {
    console.log(error);
    // Handle any errors that occur during the database query
    next(error)
  }
};

export const editprofile = async (req, res,next) => {
  try {
    const userId = req.params.id; // Assuming you have middleware that adds the user object to the request

    // Validate that the user exists
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if the desired username is already in use
    if (req.body.username && req.body.username !== user.username) {
      const existingUserWithUsername = await User.findOne({ username: req.body.username });

      if (existingUserWithUsername) {
        throw new AppError('Username is already exist', 409);
      }
    }

    // Check if the desired phone number is already in use
    if (req.body.phone && req.body.phone !== user.phone) {
      const existingUserWithPhone = await User.findOne({ phone: req.body.phone });

      if (existingUserWithPhone) {
        throw new AppError('Phone number is already in exist', 409);
      }
    }

    // Check if the desired email is already in use
    if (req.body.email && req.body.email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email: req.body.email });

      if (existingUserWithEmail) {
        throw new AppError('Email is already in exist', 409);
      }
    }

    // Update user fields based on the request data
    const allowedFields = [
      'username', 'email', 'phone', 'password', 'gender', 'dateOfBirth', 'Bio', 'profilepicture'
      // Add more fields as needed
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    // Save the updated user document
    await user.save();

    // Respond with a success message and the updated user document
    res.status(200).json({ success:'true', message: 'Profile updated successfully'});
  } catch (error) {
    console.error('Error updating profile:', error);
    next(error);
  }
}


export const addprofilepicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded.', 400)
    }

    const { originalname, buffer } = req.file;
    const params = {
      Bucket: 'shahidbucketsample',
      Key: `profile-pictures/${originalname}`, // Adjust the path and filename as needed
      Body: buffer,
    };


    // Upload the file to S3
    const uploadResponse = await s3.upload(params).promise();

    // Get the URL of the uploaded image
    const imageUrl = uploadResponse.Location;
    // Update the user's profile picture URL in the database
    await User.findByIdAndUpdate(id, { profilepicture: imageUrl });


    return res.status(200).json({ message: 'profile uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    next(error)
  }
}



export const chat=(req,res)=>{
  console.log("hhhhhhhhhhhhhhhhhhhhhiiiiiiiiii");
}