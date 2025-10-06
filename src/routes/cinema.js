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

router.route("/").get(cinemaController.getAllCinemas);

router.route("/:cinemaId").get(cinemaController.getCinema);

router
  .route("/:cinemaId/screenings")
  .get(cinemaController.getAllScreeningsFromACinema);

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
    checkStartTime,
    cinemaController.createScreeningInAnAuditorium
  );

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
