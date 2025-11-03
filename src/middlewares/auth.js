const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Screening = require("../models/screening");
const Movie = require("../models/movie");
const Review = require("../models/review");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ExpressError("No Token Found", 401));
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken.userId).select(
      "username isAdmin"
    );

    if (!user) {
      return next(new ExpressError("User invalid", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ExpressError("Expired Token", 401));
    }
    return next(new ExpressError("Invalid Token", 401));
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return next(new ExpressError("You are not allowed to do this", 403));
  next();
};

const isUser = (req, res, next) => {
  if (req.user.isAdmin)
    return next(new ExpressError("You are not allowed to do this", 403));
  next();
};

const isScreeningOwner = catchAsync(async (req, res, next) => {
  const { screeningId } = req.params;

  const screening = await Screening.findById(screeningId);

  if (!screening) {
    return next(new ExpressError("No screening found with this id", 404));
  }

  if (!screening.createdBy.equals(req.user._id)) {
    return next(new ExpressError("You are not allowed to do that", 403));
  }

  next();
});

const isMovieOwner = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  if (!movie.creator.equals(req.user._id)) {
    return next(new ExpressError("You are not allowed to do that", 403));
  }

  next();
});

const isReviewOwner = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new ExpressError("No reviews found with this id", 404));
  }

  if (!review.author.equals(req.user._id)) {
    return next(new ExpressError("You are not allowed to do that", 403));
  }

  next();
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticate,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  isAdmin,
  isUser,
  isScreeningOwner,
  isMovieOwner,
  isReviewOwner,
};
