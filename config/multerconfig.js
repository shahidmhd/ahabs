// import multer from 'multer';

// // Define storage settings for multer
// const storage = multer.memoryStorage(); // Store files in memory

// const fileFilter = (req, file, callback) => {
//   // Define allowed file types and their corresponding MIME types
//   const allowedFileTypes = {
//     'image': ['image/jpeg', 'image/png', 'image/gif'],
//     'video': ['video/mp4', 'video/quicktime'],
//     'audio': ['audio/mpeg', 'audio/wav'],
//     'pdf': ['application/pdf'],
//   };

//   const fileType = file.fieldname.toLowerCase();

//   if (allowedFileTypes[fileType] && allowedFileTypes[fileType].includes(file.mimetype)) {
//     callback(null, true);
//   } else {
//     callback(new Error(`Only ${allowedFileTypes[fileType].join(', ')} files are allowed for ${fileType} uploads.`), false);
//   }
// };

// const limits = {
//   fileSize: {
//     image: 1024 * 1024 * 5, // 5MB for images
//     video: 1024 * 1024 * 100, // 100MB for videos
//     audio: 1024 * 1024 * 20, // 20MB for audio
//     pdf: 1024 * 1024 * 10, // 10MB for PDFs
//   },
// };

// const upload = (fileType) => multer({
//   storage,
//   limits: { fileSize: limits.fileSize[fileType] },
//   fileFilter,
// }).single(fileType);

// export default upload;


// import multer from 'multer';

// // Define storage settings for multer
// const storage = multer.memoryStorage(); // Store files in memory

// // Define a function to filter file uploads based on MIME types
// const fileFilter = (req, file, callback) => {
//   // Define allowed file types and their corresponding MIME types
//   const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

//   if (allowedFileTypes.includes(file.mimetype)) {
//     // Accept the file
//     callback(null, true);
//   } else {
//     // Reject the file
//     callback(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'), false);
//   }
// };

// // Create a Multer instance with the defined settings
// const upload = multer({
//   storage, // Storage settings
//   fileFilter, // File filter function
//   limits: {
//     fileSize: 1024 * 1024 * 20, // 5MB file size limit (adjust as needed)
//   },
// });

// export default upload;
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 10000 * 70000, // 10MB (adjust this value as needed)
    },
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.pdf' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('Unsupported file type'), false);
            return;
        }
        cb(null, true);
    },
});

export default upload;
