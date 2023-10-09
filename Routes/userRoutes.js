// import express from 'express';

// const router = express.Router();

// import { addProfilePicture, editprofile, getAllUsers } from '../controllers/Usercontroller.js';
// import userAuthMid from '../middlewear/Authmiddlewear.js';



// router.get('/getallusers',userAuthMid,getAllUsers)
// router.post('/editprofile/:id',userAuthMid,editprofile)
// router.post('/addprofilepicture/:id',userAuthMid,addProfilePicture)











// export default router;


import {editprofile, getAllUsers } from '../controllers/Usercontroller.js';
import userAuthMid from '../middlewear/Authmiddlewear.js';
import express from 'express';
const router = express.Router();
import AWS from 'aws-sdk';
import multer from 'multer';
AWS.config.update({
    accessKeyId: 'AKIAR5FOBP3TTH2MPK4H',
    secretAccessKey: 'a1+LDYQHT119dPWp/uU4Q1z81hCc3lmY8YnFLbfW',
    region: 'ap-south-1', // Replace with the desired AWS region
});

const s3 = new AWS.S3();


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

router.post('/editprofile/:id', userAuthMid, editprofile);
router.get('/getallusers', userAuthMid, getAllUsers);

// Define the route for adding a profile picture
router.post('/addprofilepicture/:id', userAuthMid, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const { originalname, buffer } = req.file;
        const params = {
            Bucket: 'samplephotocyenosure',
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
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
// router.post('/addprofilepictures/:id', userAuthMid, upload.array('profilePictures', 5), async (req, res) => {
//     try {
//         const files = req.files;

//         if (!files || files.length === 0) {
//             return res.status(400).json({ message: 'No files uploaded.' });
//         }

//         const uploadPromises = files.map(async (file) => {
//             const { originalname, buffer } = file;
//             const params = {
//                 Bucket: 'samplephotocyenosure',
//                 Key: `profile-pictures/${originalname}`,
//                 Body: buffer,
//             };

//             // Upload the file to S3
//             const uploadResponse = await s3.upload(params).promise();

//             // Get the URL of the uploaded image
//             const imageUrl = uploadResponse.Location;

//             return imageUrl;
//         });

//         // Wait for all uploads to complete
//         const imageUrls = await Promise.all(uploadPromises);

//         return res.status(200).json({ message: 'Files uploaded successfully', imageUrls });
//     } catch (error) {
//         console.log(error);
//         console.error('Error uploading files to S3:', error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// });

export default router;
