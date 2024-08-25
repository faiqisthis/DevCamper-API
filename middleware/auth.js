import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "./async.js";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import Bootcamp from '../models/Bootcamps.js'
import Course from '../models/Courses.js'
import Review from "../models/Reviews.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //  else if(req.cookies.token){
  //     token=req.cookies.token
  //  }
  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (error) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
  next()
});

export const authorize=(...roles)=>{
  return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new ErrorResponse(`${req.user.role} is not authorized to access this route`),403)
    }
    next()
  }
}
export const authorizeOwnership = (model) => {
  return asyncHandler(async (req, res, next) => {
    let document;
    if (model === 'Bootcamp') {
      document = await Bootcamp.findById(req.params.id) ||await Bootcamp.findById(req.params.bootcampId);
    } else if (model === 'Course') {
      document = await Course.findById(req.params.id);
    }
    else if(model==='Review'){
      document=await Review.findById(req.params.id)
    }
  

    if (!document) {
      return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404));
    }

    // Check if the user is the owner or an admin
    if (document.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User not authorized to access this resource`, 401));
    }

    next();
  });
};

