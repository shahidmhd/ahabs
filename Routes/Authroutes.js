import express from 'express';
const router = express.Router();

import { RegisterUser, emailverification, userlogin, verifyEmail } from '../controllers/Authcontroller.js';



router.post('/register',RegisterUser)
router.post('/verifyemail',emailverification)
router.post('/verify',verifyEmail)
router.post('/login',userlogin)










export default router;
