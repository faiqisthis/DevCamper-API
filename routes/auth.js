import express from 'express'
import{registerUser,login,getMe} from '../controllers/auth.js'
import {protect} from '../middleware/auth.js'
const router=express.Router();

router.post('/register',registerUser)
router.post('/login',login)
router.get('/me',protect,getMe)
export default router;