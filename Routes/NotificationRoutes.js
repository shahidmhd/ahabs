import express from 'express';
import { getallnotification } from '../controllers/Notificationcontroller.js';
import userAuthMid from '../middlewear/Authmiddlewear.js';
const router = express.Router();




router.get('/getnotification',userAuthMid,getallnotification)










export default router;
