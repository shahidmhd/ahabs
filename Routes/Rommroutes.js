import express from 'express';
const router = express.Router();

import {createuseroom, getmessages } from '../controllers/Roomcontroller.js';
import userAuthMid from '../middlewear/Authmiddlewear.js';



router.post('/createroom/:id',userAuthMid,createuseroom)
router.get('/messages/:id',userAuthMid,getmessages)









export default router;
