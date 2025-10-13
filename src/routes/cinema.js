const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinema");
const {
  authenticate,
  isUser,
  isAdmin,
  isScreeningOwner,
} = require("../middlewares/auth");
const {
  checkStartTime,
  checkStartTimeUpdate,
  areUrlIdsInterconnected,
} = require("../middlewares/screening");
const { validateScreeningSchema } = require("../middlewares/validators");

/**
 * @swagger
 * /api/cinemas:
 *   get:
 *     summary: Get all cinemas
 *     tags: [Cinemas]
 *     responses:
 *       200:
 *         description: List of all cinemas
 */
router.route("/").get(cinemaController.getAllCinemas);

/**
 * @swagger
 * /api/cinemas/{cinemaId}:
 *   get:
 *     summary: Get a specific cinema
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema ID
 *     responses:
 *       200:
 *         description: Cinema details
 *       404:
 *         description: Cinema not found
 */
router.route("/:cinemaId").get(cinemaController.getCinema);

/**
 * @swagger
 * /api/cinemas/{cinemaId}/screenings:
 *   get:
 *     summary: Get all screenings from a cinema
 *     tags: [Screenings]
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema ID
 *     responses:
 *       200:
 *         description: List of screenings
 *       404:
 *         description: Cinema not found
 */
router
  .route("/:cinemaId/screenings")
  .get(cinemaController.getAllScreeningsFromACinema);

/**
 * @swagger
 * /api/cinemas/{cinemaId}/auditoriums/{auditoriumId}/screenings:
 *   get:
 *     summary: Get all screenings from an auditorium
 *     tags: [Screenings]
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema ID
 *       - in: path
 *         name: auditoriumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Auditorium ID
 *     responses:
 *       200:
 *         description: List of screenings
 *       404:
 *         description: Cinema or auditorium not found
 *   post:
 *     summary: Create a new screening in an auditorium
 *     tags: [Screenings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema ID
 *       - in: path
 *         name: auditoriumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Auditorium ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - startTime
 *             properties:
 *               movieId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Screening created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Cinema or auditorium not found
 */
router
  .route("/:cinemaId/auditoriums/:auditoriumId/screenings")
  .get(
    areUrlIdsInterconnected,
    cinemaController.getAllScreeningsFromAnAuditorium
  )
  .post(
    authenticate,
    isAdmin,
    areUrlIdsInterconnected,
    validateScreeningSchema,
    checkStartTime,
    cinemaController.createScreeningInAnAuditorium
  );

/**
 * @swagger
 * /api/cinemas/{cinemaId}/auditoriums/{auditoriumId}/screenings/{screeningId}:
 *   get:
 *     summary: Get a specific screening
 *     tags: [Screenings]
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema ID
 *       - in: path
 *         name: auditoriumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Auditorium ID
 *       - in: path
 *         name: screeningId
 *         required: true
 *         schema:
 *           type: string
 *         description: Screening ID
 *     responses:
 *       200:
 *         description: Screening details
 *       404:
 *         description: Screening not found
 *   put:
 *     summary: Update a screening
 *     tags: [Screenings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema ID
 *       - in: path
 *         name: auditoriumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Auditorium ID
 *       - in: path
 *         name: screeningId
 *         required: true
 *         schema:
 *           type: string
 *         description: Screening ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Screening updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Screening not found
 *   delete:
 *     summary: Delete a screening
 *     tags: [Screenings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cinema ID
 *       - in: path
 *         name: auditoriumId
 *         required: true
 *         schema:
 *           type: string
 *         description: Auditorium ID
 *       - in: path
 *         name: screeningId
 *         required: true
 *         schema:
 *           type: string
 *         description: Screening ID
 *     responses:
 *       200:
 *         description: Screening deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Screening not found
 */
router
  .route("/:cinemaId/auditoriums/:auditoriumId/screenings/:screeningId")
  .get(areUrlIdsInterconnected, cinemaController.getScreening)
  .put(
    authenticate,
    isAdmin,
    areUrlIdsInterconnected,
    isScreeningOwner,
    checkStartTimeUpdate,
    cinemaController.updateScreening
  )
  .delete(
    authenticate,
    isAdmin,
    areUrlIdsInterconnected,
    isScreeningOwner,
    cinemaController.deleteScreening
  );

module.exports = router;
