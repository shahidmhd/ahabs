import express from 'express';
const router = express.Router();


import userAuthMid from '../middlewear/Authmiddlewear.js';
import { createWorkStatus, getworkoutstatus } from '../controllers/Workcontroller.js';



router.post('/addworkstatus', userAuthMid,createWorkStatus);
router.get('/getworkstatus', userAuthMid,getworkoutstatus);


export default router;
