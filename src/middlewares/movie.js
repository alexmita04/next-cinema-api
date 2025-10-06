const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Movie = require("../models/movie");
const Review = require("../models/review");

exports.checkIfMovieCanBeUpdated = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie.creator) {
    return next(
      new ExpressError("You don't have the permission to edit this movie", 403)
    );
  }

  next();
});

exports.areUrlIdsInterconnected = catchAsync(async (req, res, next) => {
  const { movieId, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new ExpressError("No review found with this id", 404));
  }

  if (!review.movie.equals(movieId)) {
    return next(
      new ExpressError(
        `Some of the following ids don't match: movieId, reviewId`,
        404
      )
    );
  }

  next();
});
