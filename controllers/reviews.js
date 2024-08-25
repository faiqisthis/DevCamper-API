import Review from "../models/Reviews.js";
import asyncHandler from "../middleware/async.js";
import Bootcamp from "../models/Bootcamps.js";
import ErrorResponse from "../utils/errorResponse.js";

export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId || req.params.userId) {
    let query;

    if (req.params.bootcampId) {
      query = Review.find({ bootcamp: req.params.bootcampId }).populate({
        path: "bootcamp",
        select: "name description",
      });
    } else if (req.params.userId) {
      query = Review.find({ user: req.params.userId }).populate({
        path: "bootcamp",
        select: "name description",
      });
    }

    const reviews = await query;

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found",
      });
    }

    return res
      .status(200)
      .json({ success: true, length: reviews.length, data: reviews });
  }
  res.status(200).json(res.advancedResults);
});

export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res
      .status(404)
      .json({
        success: false,
        data: `No review found with this id ${req.params.id}`,
      });
  }
  res.status(200).json({ success: true, data: review });
});
export const updateReview = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    rating: req.body.rating,
    title: req.body.title,
    text: req.body.text,
  };
  const review = await Review.findByIdAndUpdate(req.params.id, fieldsToUpdate);
  if (!review) {
    return res
      .status(404)
      .json({
        success: false,
        data: `No review found with this id ${req.params.id}`,
      });
  }
  await review.constructor.getAverageRating(review.bootcamp);
  res.status(200).json({ success: true, data: {} });
});
export const deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return res
      .status(404)
      .json({
        success: false,
        data: `No review found with this id ${req.params.id}`,
      });
  } 
  await review.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
export const createReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp does not exist with ID ${req.params.id}`)
    );
  }
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user;
  const review = await (
    await Review.create(req.body)
  ).populate({
    path: "bootcamp",
    select: "name description",
  });
  res.status(200).json({ success: true, data: review });
});
