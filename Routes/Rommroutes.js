import express from 'express';
const router = express.Router();

import {createuseroom, deleteMessage, getChattedUsers, getmessages } from '../controllers/Roomcontroller.js';
import userAuthMid from '../middlewear/Authmiddlewear.js';



router.post('/createroom/:id',userAuthMid,createuseroom)
router.get('/messages/:id',userAuthMid,getmessages)
router.get('/chatted-users', userAuthMid, getChattedUsers);
router.delete('/deletechat/:id', userAuthMid,deleteMessage);







export default router;
