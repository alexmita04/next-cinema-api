const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const utcDate = require("../utils/utcDate");
const Movie = require("../models/movie");
const Screening = require("../models/screening");
const Review = require("../models/review");

const createSlug = (title) => {
  let slug = title
    .split(" ")
    .map((slugEl) => slugEl.toLowerCase())
    .join("-");

  console.log(slug);
  return slug;
};

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.find({});

  res.json({
    status: "success",
    data: {
      movies,
      length: movies.length,
    },
  });
});

exports.addMovie = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    duration,
    releaseDate,
    genres,
    director,
    production,
    distribution,
    coverImage,
    trailer,
    cast,
  } = req.body;

  const correctReleaseDate = utcDate(releaseDate);
  const slug = createSlug(title);

  const newMovie = new Movie({
    title,
    description,
    duration,
    releaseDate: correctReleaseDate,
    genres,
    director,
    production,
    distribution,
    coverImage,
    trailer,
    cast,
    creator: req.user._id,
    slug,
  });

  await newMovie.save();

  res.json({
    status: "success",
    data: { newMovie },
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  res.json({
    status: "success",
    data: { movie },
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const updateProp = req.body;

  if (updateProp.title) {
    updateProp.slug = createSlug(updateProp.title);
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    movieId,
    {
      ...updateProp,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedMovie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  res.json({
    status: "success",
    data: { updatedMovie },
  });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const deletedMovie = await Movie.findByIdAndDelete(movieId);

  if (!deletedMovie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  res.json({
    status: "success",
    data: { deletedMovie },
  });
});

exports.getAllScreenings = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  const screenings = await Screening.find({ movie: movieId }).populate([
    "cinema",
    "auditorium",
  ]);

  res.json({
    status: "success",
    data: {
      movie,
      screenings,
      length: screenings.length,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  const review = await Review.find({ movie: movieId });

  res.json({
    status: "success",
    data: {
      movie,
      review,
      length: review.length,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  const { rating, body } = req.body;

  const newReview = new Review({
    author: req.user._id,
    movie: movieId,
    rating,
    body,
  });

  await newReview.save();

  res.json({
    status: "success",
    data: {
      newReview,
      movie,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { movieId, reviewId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  const updateFields = {};

  if (req.body.title) updateFields.title = req.body.title;
  if (req.body.rating) updateFields.rating = req.body.rating;

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { ...updateFields },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedReview) {
    return next(new ExpressError("No review found with this id", 404));
  }

  res.json({
    status: "success",
    updatedReview,
    movie,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { movieId, reviewId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return next(new ExpressError("No movie found with this id", 404));
  }

  const deletedReview = await Review.findByIdAndDelete(reviewId);

  if (!deletedReview) {
    return next(new ExpressError("No review found with this id", 404));
  }

  res.json({
    status: "success",
    data: {
      deletedReview,
      movie,
    },
  });
});
