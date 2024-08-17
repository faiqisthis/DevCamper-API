
import User from '../models/Users.js';
import asyncHandler from '../middleware/async.js';
export default registerUser=asyncHandler(async(req,res,next)=>{
    res.status(200).json({success:true})
})