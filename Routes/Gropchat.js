import express from 'express';
const router = express.Router();
import upload from '../config/multerconfig.js'
import userAuthMid from '../middlewear/Authmiddlewear.js';
import { addAdmin, addUserToGroup, creategroup, deletegroup, editgroup, exitGroup, getGroupMembers, removeAdmin, removeUserFromGroup } from '../controllers/Groupcontroller.js';
import { addmessage, deleteforeveryone, getmessages, messagedeleteforme } from '../controllers/Groupchatcontroller.js';



router.post('/creategroup',userAuthMid,upload.single('image'),creategroup)
router.post('/editgroup/:groupId', userAuthMid, upload.single('image'), editgroup);
router.delete('/deletegroup/:groupId', userAuthMid, deletegroup);
router.post('/addUser/:groupId',userAuthMid, addUserToGroup);
router.post('/removegroups/:groupId/removeUser/:userIdToRemove',userAuthMid,removeUserFromGroup);
router.post('/exitgroup/:groupId', userAuthMid, exitGroup);
router.post('/addadmin/:groupId',userAuthMid, addAdmin);
router.post('/removeadmin/:groupId',userAuthMid,removeAdmin);
router.get('/groupmembers/:groupId',userAuthMid, getGroupMembers)


router.post('/sendmessage/:groupId',userAuthMid,addmessage)
router.put('/deleteforme/:id',userAuthMid,messagedeleteforme)
router.put('/deleteforeveryone/:id',userAuthMid,deleteforeveryone)
router.get('/getallmessages/:id',userAuthMid,getmessages)
export default router;
