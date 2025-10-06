const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie");
const { authenticate, isAdmin, isUser } = require("../middlewares/auth");
const {
  checkIfMovieCanBeUpdated,
  areUrlIdsInterconnected,
} = require("../middlewares/movie");

router
  .route("/")
  .get(movieController.getAllMovies)
  .post(authenticate, isAdmin, movieController.addMovie);

router
  .route("/:movieId")
  .get(movieController.getMovie)
  .put(
    authenticate,
    isAdmin,
    // checkIfMovieCanBeUpdated,
    movieController.updateMovie
  )
  .delete(authenticate, isAdmin, movieController.deleteMovie);

router.route("/:movieId/screenings").get(movieController.getAllScreenings);

router
  .route("/:movieId/reviews")
  .get(movieController.getAllReviews)
  .post(authenticate, isUser, movieController.createReview);

router
  .route("/:movieId/reviews/:reviewId")
  .put(
    authenticate,
    isUser,
    areUrlIdsInterconnected,
    movieController.updateReview
  )
  .delete(
    authenticate,
    isUser,
    areUrlIdsInterconnected,
    movieController.deleteReview
  );

module.exports = router;
