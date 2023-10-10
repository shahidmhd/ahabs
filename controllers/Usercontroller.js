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

export const editprofile = async (req, res) => {
  console.log(req.params.username);
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

    return res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    next(error)
  }
}
