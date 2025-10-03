if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./src/config.env" });
}
const db = require("../config/db");

const Movie = require("../models/movie");
const Auditorium = require("../models/auditorium");
const Cinema = require("../models/cinema");
const Screening = require("../models/screening");

const movieData = require("./movies.json");
const auditoriumData = require("./auditoriums.json");
const cinemaData = require("./cinemas.json");

const clearDatabase = async () => {
  await Screening.deleteMany({});
  await Cinema.deleteMany({});
  await Auditorium.deleteMany({});
  await Movie.deleteMany({});
};
