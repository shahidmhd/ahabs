import express from 'express';
const router = express.Router();


import userAuthMid from '../middlewear/Authmiddlewear.js';
import { createEducationStatus, getEducationstatus } from '../controllers/Educationcontroller.js';


router.post('/addeducationstatus', userAuthMid,createEducationStatus);
router.get('/geteducationstatus', userAuthMid,getEducationstatus);


export default router;
