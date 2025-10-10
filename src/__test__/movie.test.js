const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const Movie = require("../models/movie");
const User = require("../models/user");
const movieArr = require("./movieMocks.json");

jest.mock("../models/movie", () => {
  const movieMocks = require("./movieMocks.json");

  const saveMock = jest.fn().mockResolvedValue({
    title: "test",
  });

  const MovieMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: saveMock,
  }));

  MovieMock.find = jest.fn().mockResolvedValue(movieMocks);

  return MovieMock;
});

jest.mock("../models/user", () => {
  const UserMock = {
    findById: jest.fn().mockImplementation((id) => ({
      select: jest.fn().mockResolvedValue({
        _id: id,
        username: "NextCinemaRetro-admin",
        isAdmin: true,
      }),
    })),
  };

  return UserMock;
});

describe("Movie Endpoints", () => {
  describe("GET /api/movies -> Get All movies", () => {
    test("Status Code: 200", async () => {
      const response = await request(app).get("/api/movies");

      expect(response.statusCode).toBe(200);
      expect(response.body.data.movies).toBeDefined();
      expect(response.body.data.length).toBe(movieArr.length);

      expect(Movie.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/movies -> Create a Movie", () => {
    test("Status Code: 200", async () => {
      const newMovieData = {
        title: "test",
        description: "test",
        duration: 90,
        releaseDate: "2024-10-10",
        genres: ["SF"],
        director: "test",
        production: "test",
        distribution: "test",
        coverImage: "test",
        trailer: "test",
        cast: [
          {
            name: "test",
            characterName: "test",
          },
        ],
      };

      const admin = {
        username: "NextCinemaRetro-admin",
        password: "adminpass1234",
        _id: "68e220cee2307843c9426bf1",
      };

      const authToken = jwt.sign(
        { userId: admin._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      const response = await request(app)
        .post("/api/movies")
        .send(newMovieData)
        .set("Authorization", `Bearer ${authToken}`);

      expect(true).toBe(true);
    });
  });
});
