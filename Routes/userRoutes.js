import express from 'express';

const router = express.Router();

import { getAllUsers } from '../controllers/Usercontroller.js';
import userAuthMid from '../middlewear/Authmiddlewear.js';



router.get('/users',userAuthMid,getAllUsers)











export default router;
