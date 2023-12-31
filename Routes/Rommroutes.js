import express from 'express';
const router = express.Router();

import {addmessage, chattedrooms, clearchat, createuseroom, deleteMessage, deleteforeveryone,getmessages, messagedeleteforme } from '../controllers/Roomcontroller.js';
import userAuthMid from '../middlewear/Authmiddlewear.js';


router.post('/addchat', userAuthMid,addmessage);
router.post('/createroom/:id',userAuthMid,createuseroom)
router.get('/messages/:id',userAuthMid,getmessages)
router.delete('/deletechat/:id', userAuthMid,deleteMessage);
router.put('/deleteforme/:id', userAuthMid,messagedeleteforme);
router.post('/deleteforeveryone/:id', userAuthMid,deleteforeveryone);
router.get('/chattedrooms', userAuthMid, chattedrooms);
router.get('/clearchat/:id', userAuthMid,clearchat);
// router.get('/chatted-users', userAuthMid, getChattedUsers);

export default router;
