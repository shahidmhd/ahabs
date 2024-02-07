import express from "express";
import { AddMenus, GetAllMenus } from "../../controllers/Admin/Menu.js";
import upload from "../../config/multerconfig.js";
const router = express.Router()

router.post('/add-menu',upload.single("image"),AddMenus);
router.get('/get-menu',GetAllMenus);

export default router