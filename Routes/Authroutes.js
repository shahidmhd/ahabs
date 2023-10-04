import express from 'express';
const router = express.Router();

import { RegisterUser, emailverification } from '../controllers/Authcontroller.js';



router.post('/register',RegisterUser)
router.post('/verifyemail',emailverification)







export default router;
