import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "./async.js";
import User from "../models/Users.js";
import jwt from "jsonwebtoken";

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
