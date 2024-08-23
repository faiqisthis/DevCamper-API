import User from '../models/Users.js'
import asyncHandler from '../middleware/async.js'
import getAdvancedResults from '../middleware/advancedResults.js'
export const getUsers=asyncHandler(async(req,res,next)=>{
res.status(200).json(res.advancedResults)
})

export const getUserByID=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({success:false,message:'User not found'})
    }
    res.status(200).json({success:true,data:user})
})

export const updateUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findByIdAndUpdate(req.params.id,req.body)
    if(!user){
        return res.status(404).json({success:false,message:'User not found'})
    }
    res.status(201).json({success:true,data:{}})
})

export const deleteUser=asyncHandler(async(req,res,next)=>{
const user=await User.findByIdAndDelete(req.params.id)
if(!user){
    return res.status(404).json({success:false,message:'User not found'})
}
res.status(201).json({success:true,data:{}})
})

export const createUser=asyncHandler(async(req,res,next)=>{
    const user=await User.create(req.body)
    res.status(200).json({success:true,data:user})
})



