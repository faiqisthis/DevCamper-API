import Course from "../models/Courses.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import Bootcamp from "../models/Bootcamps.js";
import jwt from "jsonwebtoken";
export const getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
    const courses = await query;

    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

export const getCourseByID = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});
export const createCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with id of ${req.params.bootcampId}`,
        404
      )
    );
  }
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user;
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});
export const deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findByIdAndUpdate(req.params.id, { tuition: 0 });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  course = await Course.findById(req.params.id);
  await course.constructor.getAverageCost(course.bootcamp);
  await Course.findByIdAndDelete(req.params.id);
  res.status(201).json({ success: true, data: {} });
});
export const updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
    );
  }
  await course.constructor.getAverageCost(course.bootcamp);
  res.status(201).json({ success: true, data: course });
});
