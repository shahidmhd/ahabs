import express from 'express';
const router = express.Router();


import userAuthMid from '../middlewear/Authmiddlewear.js';
import { createprofiledetails, getprofiledetails } from '../controllers/Profiledetailcontroller.js';




router.post('/addprofiledetails', userAuthMid,createprofiledetails);
router.get('/getprofiledetails', userAuthMid,getprofiledetails);


export default router;
