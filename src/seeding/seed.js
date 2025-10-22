// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config({ path: "./src/config.env" });
// }
// const db = require("../config/db");
// const utcDate = require("../utils/utcDate");

const Movie = require("../models/movie");
const Auditorium = require("../models/auditorium");
const Cinema = require("../models/cinema");
const Screening = require("../models/screening");
const User = require("../models/user");
const Review = require("../models/review");
const Ticket = require("../models/ticket");

const movieData = require("./movies.json");
const auditoriumData = require("./auditoriums.json");
const cinemaData = require("./cinemas.json");

const { ADMIN_PASSWORD, ADMIN_PUBLIC_PASSWORD } = process.env;

const CINEMA_COUNTER = cinemaData.length;
const AUDITORIUM_COUNTER = auditoriumData.length;
const SCREENING_COUNTER_PER_DAY = 2;
const SCREENING_COUNTER_DAYS = 10;

const clearDatabase = async () => {
  await Screening.deleteMany({});
  await User.deleteMany({ isAdmin: true });
  await Cinema.deleteMany({});
  await Auditorium.deleteMany({});
  await Movie.deleteMany({});
  await Review.deleteMany({});
  await Ticket.deleteMany({});
};

const createAdmin = async (cinemaName, isPublic) => {
  const username = `${cinemaName.split(" ").join("")}-admin`;
  const password = isPublic ? ADMIN_PUBLIC_PASSWORD : ADMIN_PASSWORD;

  const newAdmin = new User({
    username,
    password,
    dateOfBirth: Date.now(),
    gender: "Prefer not to say",
    phoneNumber: "123456789",
    address: "1234 Main Street Los Angeles, CA 90012",
    isAdmin: true,
  });

  await newAdmin.save();

  return newAdmin._id;
};

const getRandomMovie = (moviesArr) => {
  const randomNum = Math.floor(Math.random() * moviesArr.length);
  return moviesArr[randomNum];
};

const populateDatabase = async () => {
  await clearDatabase();

  const movies = await Movie.insertMany(movieData);

  for (let i = 0; i < CINEMA_COUNTER; i++) {
    let newCinema = new Cinema({ ...cinemaData[i] });

    for (let j = 0; j < AUDITORIUM_COUNTER; j++) {
      const newAuditorium = new Auditorium(auditoriumData[j]);
      await newAuditorium.save();
      newCinema.auditoriums.push(newAuditorium);

      let currentHour = newCinema.openingHour;
      for (let k = 0; k < SCREENING_COUNTER_PER_DAY; k++) {
        const screeningMovie = getRandomMovie(movies);
        const endHour = Math.floor(screeningMovie.duration / 60) + 1;
        const now = Date.now();
        const currentDate = new Date(now);

        for (let l = 0; l < SCREENING_COUNTER_DAYS; l++) {
          const utcMidnight = new Date(
            Date.UTC(
              currentDate.getUTCFullYear(),
              currentDate.getUTCMonth(),
              currentDate.getUTCDate() + l,
              0,
              0,
              0,
              0
            )
          );
          const newScreening = new Screening({
            auditorium: newAuditorium._id,
            movie: screeningMovie._id,
            cinema: newCinema._id,
            startTime: currentHour,
            pricing: Math.floor(Math.random() * 10) + 10,
            language: "English (EN)",
            subtitle: "English (EN)",
            date: utcMidnight,
          });

          await newScreening.save();
        }

        currentHour = currentHour + endHour + 1;
      }
    }

    adminId = await createAdmin(
      newCinema.name,
      i === CINEMA_COUNTER - 1 ? true : false
    );

    newCinema.admin = adminId;

    await newCinema.save();
  }

  console.log("SEED-SUCCESS");
};

module.exports = populateDatabase;
