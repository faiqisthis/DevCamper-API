import getAdvancedResults from '../middleware/advancedResults.js'
import User from '../models/Users.js'
import { protect,authorize } from '../middleware/auth.js'
import { getUsers,getUserByID, updateUser, deleteUser, createUser} from '../controllers/user.js'
import reviewRouter from './reviews.js'
import express from 'express'
const router=express.Router()
router.use(protect)//Another way to use middlewares. this way the middleware will be fired on every request
router.get('/',authorize('admin'),getAdvancedResults(User),getUsers)
router.get('/:id',authorize('admin'),getUserByID)
router.put('/:id',authorize('admin'),updateUser)
router.delete('/:id',authorize('admin'),deleteUser)
router.post('/',authorize('admin'),createUser)
router.use('/:userId/reviews',reviewRouter)
export default router