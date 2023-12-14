import express from 'express';
const router = express.Router();


import userAuthMid from '../middlewear/Authmiddlewear.js';
import { getAlldresstypes, getAllprofiletypes, getAllworktypes } from '../controllers/Defaultcontroller.js';



router.get('/getallprofiletype', userAuthMid,getAllprofiletypes);
router.get('/getallworktype', userAuthMid,getAllworktypes);
router.get('/getalldresstype', userAuthMid,getAlldresstypes);


export default router;
