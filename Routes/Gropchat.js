import express from 'express';
const router = express.Router();
import upload from '../config/multerconfig.js'
import userAuthMid from '../middlewear/Authmiddlewear.js';
import { addAdmin, addUserToGroup, creategroup, deletegroup, editgroup, exitGroup, getGroupMembers, removeAdmin, removeUserFromGroup } from '../controllers/Groupcontroller.js';



router.post('/creategroup',userAuthMid,upload.single('image'),creategroup)
router.put('/editgroup/:groupId', userAuthMid, upload.single('image'), editgroup);
router.delete('/deletegroup/:groupId', userAuthMid, deletegroup);
router.post('/addUser/:groupId',userAuthMid, addUserToGroup);
router.post('/removegroups/:groupId/removeUser/:userIdToRemove',userAuthMid,removeUserFromGroup);
router.post('/exitgroup/:groupId', userAuthMid, exitGroup);
router.post('/addadmin/:groupId',userAuthMid, addAdmin);
router.post('/removeadmin/:groupId',userAuthMid,removeAdmin);
router.get('/groupmembers/:groupId',userAuthMid, getGroupMembers)
export default router;
