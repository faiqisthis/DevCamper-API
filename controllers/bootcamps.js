import Bootcamp from "../models/Bootcamps.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import upload from '../middleware/photoUpload.js';
import jwt from 'jsonwebtoken'

export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

export const getBootcampByID = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate({
    path:'courses',
    select:'title'
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`An object with ID ${req.params.id} was not found`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

export const addBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user=req.user
  const publishedBootcamp=await Bootcamp.findOne({user:req.user})
  if(publishedBootcamp&&req.user.role!=='admin'){
    return next(new ErrorResponse(`A user cannot create more than one bootcamp`,403))
  }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

export const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`An object with ID ${req.params.id} was not found`, 404)
    );
  }
  
  res.status(200).json({ success: true, data: {}});
});

export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`An object with ID ${req.params.id} was not found`, 404)
    );
  }
  await bootcamp.model('Course').deleteMany({bootcamp:bootcamp._id})
  await Bootcamp.findByIdAndDelete(req.params.id)
  res.status(200).json({ success: true,data:{} });
});

export const uploadBootcampImage = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  upload(req, res, async function(err) {
    if (err) {
      return next(new ErrorResponse(err, 400));
    }

    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Save image path to the Bootcamp
    bootcamp.photo = req.file.path;
    await bootcamp.save();

    res.status(200).json({
      success: true,
      data: bootcamp.photo
    });
  });
});