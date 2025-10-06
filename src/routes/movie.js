const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie");
const {
  authenticate,
  isAdmin,
  isUser,
  isMovieOwner,
  isReviewOwner,
} = require("../middlewares/auth");
const {
  checkIfMovieCanBeUpdated,
  areUrlIdsInterconnected,
} = require("../middlewares/movie");
const { checkReviewCountPerUser } = require("../middlewares/review");

router
  .route("/")
  .get(movieController.getAllMovies)
  .post(authenticate, isAdmin, movieController.addMovie);

router
  .route("/:movieId")
  .get(movieController.getMovie)
  .put(authenticate, isAdmin, isMovieOwner, movieController.updateMovie)
  .delete(authenticate, isAdmin, isMovieOwner, movieController.deleteMovie);

router.route("/:movieId/screenings").get(movieController.getAllScreenings);

router
  .route("/:movieId/reviews")
  .get(movieController.getAllReviews)
  .post(
    authenticate,
    isUser,
    checkReviewCountPerUser,
    movieController.createReview
  );

router
  .route("/:movieId/reviews/:reviewId")
  .put(
    authenticate,
    isUser,
    areUrlIdsInterconnected,
    isReviewOwner,
    movieController.updateReview
  )
  .delete(
    authenticate,
    isUser,
    areUrlIdsInterconnected,
    isReviewOwner,
    movieController.deleteReview
  );

module.exports = router;
