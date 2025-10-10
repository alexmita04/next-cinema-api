const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Screening = require("../models/screening");
const utcDate = require("../utils/utcDate");
const Cinema = require("../models/cinema");

const canBeProgrammedFunc = (screenings, startTime) => {
  let canBeProgrammed = true;

  for (const screening of screenings) {
    const durationInHours =
      Math.floor(screening.movie.duration / 60) +
      (screening.movie.duration % 60 !== 0 ? 1 : 0);

    if (
      startTime >= screening.startTime &&
      startTime < screening.startTime + durationInHours
    ) {
      // console.log(startTime);
      // console.log(screening.startTime);
      // console.log(screening.startTime + durationInHours);
      canBeProgrammed = false;
      break;
    }
  }

  return canBeProgrammed;
};

exports.checkStartTime = catchAsync(async (req, res, next) => {
  const { auditoriumId } = req.params;

  const { date, startTime } = req.body;

  const startOfDay = utcDate(date);
  const endOfDay = new Date(startOfDay.getTime());
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  let screenings = await Screening.find({
    auditorium: auditoriumId,
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  }).populate("movie");

  const canBeProgrammed = canBeProgrammedFunc(screenings, startTime);

  if (!canBeProgrammed)
    return next(
      new ExpressError(
        `Can't schedule the screening, the time interval is already in used by another screening in this auditorium`,
        409
      )
    );

  next();
});

exports.checkStartTimeUpdate = catchAsync(async (req, res, next) => {
  const { auditoriumId, screeningId } = req.params;

  const { date, startTime } = req.body;

  const startOfDay = utcDate(date);
  const endOfDay = new Date(startOfDay.getTime());
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  let screenings = await Screening.find({
    $and: [
      { auditorium: auditoriumId },
      {
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
      { _id: { $ne: screeningId } },
    ],
  }).populate("movie");

  const canBeProgrammed = canBeProgrammedFunc(screenings, startTime);

  if (!canBeProgrammed)
    return next(
      new ExpressError(
        `Can't schedule the screening, the time interval is already in used by another screening in this auditorium`,
        409
      )
    );

  next();
});

exports.areUrlIdsInterconnected = catchAsync(async (req, res, next) => {
  const { cinemaId, auditoriumId, screeningId = null } = req.params;

  const cinema = await Cinema.findById(cinemaId);

  const cinemaContainsAuditorium = cinema.auditoriums.some((auditorium) =>
    auditorium.equals(auditoriumId)
  );

  if (!cinemaContainsAuditorium)
    return next(
      new ExpressError(
        "Some of the following ids don't match: cinemaId, auditoriumId, screeningId",
        404
      )
    );

  if (screeningId) {
    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return next(new ExpressError("No screening found with this id", 404));
    }
    if (
      !screening.auditorium.equals(auditoriumId) ||
      !screening.cinema.equals(cinemaId)
    )
      return next(
        new ExpressError(
          "Some of the following ids don't match: CinemaId, AuditoriumId, ScreeningId",
          404
        )
      );
  }

  next();
});
