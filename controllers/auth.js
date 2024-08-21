
import User from '../models/Users.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
export const registerUser=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        role
    });
    sendTokenResponse(user,200,res)
})

export const login=asyncHandler(async(req,res,next)=>{
   const {email,password}=req.body
   if(!email || !password){
    return next(new ErrorResponse('Email and password are required',400))
   }
   const user=await User.findOne({email}).select('+password')
   if(!user){
    return next(new ErrorResponse('Invalid Credentials',401))
   }

   const isMatch= await user.matchPassword(password)
   if(!isMatch){
    return next(new ErrorResponse('Invalid Credentials',401))
   }
   sendTokenResponse(user,200,res)
})

export const getMe=asyncHandler(async(req,res,next)=>{
    
    const user=await User.findById(req.user.id)
    res.status(200).json({success:true,data:user})

})

const sendTokenResponse=(user,statusCode,res) => {
    const token=user.getSignedJwtToken();
    if(process.env.NODE_ENVIRONEMNT==='production'){
        options.secure=true
    }
    const options={
        expires:new Date(Date.now()+process.env.JWT_EXPIRE_COOKIE*24*60*60*1000),
        httpOnly:true
    }

    res.status(statusCode).cookie('token',token,options).json({success:true,token})
}
