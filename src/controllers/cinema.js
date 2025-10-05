const catchAsync = require("../utils/catchAsync");
const Cinema = require("../models/cinema");
const Screening = require("../models/screening");
const Auditorium = require("../models/auditorium");
const Movie = require("../models/movie");
const ExpressError = require("../utils/ExpressError");
const utcDate = require("../utils/utcDate");

const normalizeToUTCMidnight = (date) => {
  const newDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  return newDate;
};

exports.getAllCinemas = catchAsync(async (req, res, next) => {
  const cinemas = await Cinema.find({});
  res.json({
    status: "success",
    data: {
      cinemas,
      cinemas_length: cinemas.length,
    },
  });
});

exports.getCinema = catchAsync(async (req, res, next) => {
  const { cinemaId } = req.params;

  const cinema = await Cinema.findById(cinemaId);

  if (!cienma) {
    return next(new ExpressError("No cinema found with this id", 404));
  }

  res.json({
    status: "success",
    data: {
      cinema,
    },
  });
});

exports.getAllScreeningsFromACinema = catchAsync(async (req, res, next) => {
  const { cinemaId } = req.params;

  let { date } = req.query;
  if (date) date = utcDate(date);
  else date = normalizeToUTCMidnight(new Date(Date.now()));

  if (date < normalizeToUTCMidnight(new Date(Date.now())))
    throw new ExpressError("The date is in the past", 400);

  const startOfDay = date;
  const endOfDay = new Date(startOfDay.getTime());
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

  const cinema = await Cinema.findById(cinemaId);

  if (!cinema) {
    return next(new ExpressError("No cinema found with this id", 404));
  }

  if (!cinema) {
    return next(new ExpressError("No cinema found with this id", 404));
  }

  const screenings = await Screening.find({
    cinema: cinema._id,
    $or: [
      {
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
      { type: "Recurring" },
    ],
  });

  res.json({
    status: "success",
    data: {
      cinema,
      screenings,
      screenings_length: screenings.length,
    },
  });
});

exports.getAllScreeningsFromAnAuditorium = catchAsync(
  async (req, res, next) => {
    const { cinemaId, auditoriumId } = req.params;

    let { date } = req.query;
    if (date) date = utcDate(date);
    else date = normalizeToUTCMidnight(new Date(Date.now()));

    if (date < normalizeToUTCMidnight(new Date(Date.now())))
      throw new ExpressError("The date is in the past", 400);

    const startOfDay = date;
    const endOfDay = new Date(startOfDay.getTime());
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const cinema = await Cinema.findById(cinemaId);

    if (!cinema) {
      return next(new ExpressError("No cinema found with this id", 404));
    }

    const screenings = await Screening.find({
      cinema: cinemaId,
      auditorium: auditoriumId,
      $or: [
        {
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
        { type: "Recurring" },
      ],
    }).populate("movie");

    if (!screening) {
      return next(new ExpressError("No screening found with this id", 404));
    }

    res.json({
      status: "success",
      cinema,
      screenings,
      screenings_length: screenings.length,
    });
  }
);

exports.createScreeningInAnAuditorium = catchAsync(async (req, res, next) => {
  const { cinemaId, auditoriumId } = req.params;
  const { movieId, date, startTime, pricing, language, subtitle } = req.body;

  const correctDate = utcDate(date);

  const newScreening = new Screening({
    auditorium: auditoriumId,
    movie: movieId,
    cinema: cinemaId,
    date: correctDate,
    startTime,
    pricing,
    language,
    subtitle,
  });

  await newScreening.save();

  res.json({
    status: "success",
    screening_created: newScreening,
  });
});

exports.getScreening = catchAsync(async (req, res, next) => {
  const { cinemaId, auditoriumId, screeningId } = req.params;

  let screening = await Screening.findById(screeningId).populate([
    "movie",
    "cinema",
    "auditorium",
  ]);

  if (!screening) {
    return next(new ExpressError("No screening found with this id", 404));
  }

  res.json({
    status: "success",
    data: {
      screening,
    },
  });
});

exports.updateScreening = catchAsync(async (req, res, next) => {
  const { cinemaId, auditoriumId, screeningId } = req.params;
  const { date, starTime, price, language, subtitle } = req.body;

  const utcDate = utcDate(date);

  const screening = await Screening.findByIdAndUpdate(screeningId, {
    date: utcDate,
    starTime,
    price,
    language,
    subtitle,
  });

  if (!screening) {
    return next(new ExpressError("No screening found with this id", 404));
  }

  res.json({
    status: "success",
    screening,
  });
});

exports.deleteScreening = catchAsync(async (req, res, next) => {
  const { screeningId } = req.params;

  const deletedScreening = await Screening.findByIdAndDelete(screeningId);

  if (!deletedScreening) {
    return next(new ExpressError("No screening found with this id", 404));
  }

  res.json({
    status: "success",
    deletedScreening,
  });
});
