import express from 'express';
const router = express.Router();


import userAuthMid from '../middlewear/Authmiddlewear.js';
import { Addfamilymember } from '../controllers/Familycontroller.js';




router.post('/addrelationship/:id', userAuthMid,Addfamilymember);



export default router;
