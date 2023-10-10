// import express from 'express';

// const router = express.Router();

// import { addProfilePicture, editprofile, getAllUsers } from '../controllers/Usercontroller.js';
// import userAuthMid from '../middlewear/Authmiddlewear.js';



// router.get('/getallusers',userAuthMid,getAllUsers)
// router.post('/editprofile/:id',userAuthMid,editprofile)
// router.post('/addprofilepicture/:id',userAuthMid,addProfilePicture)











// export default router;


import {addprofilepicture, editprofile, getAllUsers } from '../controllers/Usercontroller.js';
import userAuthMid from '../middlewear/Authmiddlewear.js';
import express from 'express';
const router = express.Router();
import upload from '../config/multerconfig.js'





router.get('/getallusers', userAuthMid, getAllUsers);
router.post('/editprofile/:id', userAuthMid, editprofile);
router.post('/addprofilepicture/:id', userAuthMid, upload.single('profilePicture'),addprofilepicture);


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
