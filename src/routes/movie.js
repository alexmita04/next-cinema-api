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
const {
  validateReviewSchema,
  validateMovieSchema,
} = require("../middlewares/validators");

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of all movies
 *   post:
 *     summary: Add a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router
  .route("/")
  .get(movieController.getAllMovies)
  .post(authenticate, isAdmin, validateMovieSchema, movieController.addMovie);

/**
 * @swagger
 * /movies/{movieId}:
 *   get:
 *     summary: Get a specific movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 *   put:
 *     summary: Update a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin and movie owner access required
 *       404:
 *         description: Movie not found
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin and movie owner access required
 *       404:
 *         description: Movie not found
 */
router
  .route("/:movieId")
  .get(movieController.getMovie)
  .put(authenticate, isAdmin, isMovieOwner, movieController.updateMovie)
  .delete(authenticate, isAdmin, isMovieOwner, movieController.deleteMovie);

/**
 * @swagger
 * /movies/{movieId}/screenings:
 *   get:
 *     summary: Get all screenings for a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: List of screenings
 *       404:
 *         description: Movie not found
 */
router.route("/:movieId/screenings").get(movieController.getAllScreenings);

/**
 * @swagger
 * /movies/{movieId}/reviews:
 *   get:
 *     summary: Get all reviews for a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: List of reviews
 *       404:
 *         description: Movie not found
 *   post:
 *     summary: Create a review for a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User access required
 *       404:
 *         description: Movie not found
 */
router
  .route("/:movieId/reviews")
  .get(movieController.getAllReviews)
  .post(
    authenticate,
    isUser,
    checkReviewCountPerUser,
    validateReviewSchema,
    movieController.createReview
  );

/**
 * @swagger
 * /movies/{movieId}/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Review owner access required
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Review owner access required
 *       404:
 *         description: Review not found
 */
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
