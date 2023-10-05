import express from 'express';
const router = express.Router();

import { RegisterUser, emailverification, verifyemail } from '../controllers/Authcontroller.js';



router.post('/register',RegisterUser)
router.post('/verifyemail',emailverification)
router.get('/verify',verifyemail)







export default router;
