const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");

exports.checkReviewCountPerUser = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ author: req.user._id });

  if (reviews.length) {
    return next(
      new ExpressError("You already have an review on this movie!", 409)
    );
  }

  next();
});
