// Express App Object
const express = require("express");
const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const ExpressError = require("./utils/ExpressError");
const userRouter = require("./routes/user");
const cinemaRouter = require("./routes/cinema");
const movieRouter = require("./routes/movie");
const ticketRouter = require("./routes/ticket");
const ticketController = require("./controllers/ticket");

// Essential Middleware
app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  ticketController.webhookHandler
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(helmet());

const corsOptions = {
  origin: ["http://localhost:8080"], // to be added
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
app.use(limiter);

app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/cinemas", cinemaRouter);
app.use("/api/movies", movieRouter);
app.use("/api/tickets", ticketRouter);

app.use((req, res, next) => {
  next(new ExpressError(`Not Found - ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  if (err.isOperational) {
    const { statusCode = 500, message = "Something went wrong" } = err;

    return res.status(statusCode).json({
      status: "error",
      message: message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  console.log(err);

  res.status(500).json({
    status: "error",
    message: "Something went Wrong!",
  });
});

module.exports = app;
