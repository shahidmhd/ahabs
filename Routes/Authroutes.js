import express from 'express';
const router = express.Router();

import { RegisterUser, emailverification, userlogin, verifyemail } from '../controllers/Authcontroller.js';



router.post('/register',RegisterUser)
router.post('/verifyemail',emailverification)
router.get('/verify',verifyemail)
router.post('/login',userlogin)










export default router;
