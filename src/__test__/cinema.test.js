const request = require("supertest");
const app = require("../app");

const Cinema = require("../models/cinema");
const cinemaArr = require("./cinemaMocks.json");

jest.mock("../models/cinema", () => {
  const cinemaMocks = require("./cinemaMocks.json");

  const CinemaMock = {};

  CinemaMock.find = jest.fn().mockResolvedValue(cinemaMocks);

  return CinemaMock;
});

describe("Cinema Endpoints", () => {
  describe("GET /api/cinemas -> Get All Cinemas", () => {
    test("Status Code: 200", async () => {
      const response = await request(app).get("/api/cinemas");

      expect(response.statusCode).toBe(200);
      expect(response.body.data.cinemas).toBeDefined();
      expect(response.body.data.length).toBe(cinemaArr.length);

      expect(Cinema.find).toHaveBeenCalledTimes(1);
    });
  });
});
