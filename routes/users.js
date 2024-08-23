import getAdvancedResults from '../middleware/advancedResults.js'
import User from '../models/Users.js'
import { protect,authorize } from '../middleware/auth.js'
import { getUsers,getUserByID, updateUser, deleteUser, createUser } from '../controllers/user.js'

import express from 'express'
const router=express.Router()
router.use(protect)//Another way to use middlewares. this way the middleware will be fired on every request
router.use(authorize('admin'))
router.get('/',getAdvancedResults(User),getUsers)
router.get('/:id',getUserByID)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)
router.post('/',createUser)
export default router