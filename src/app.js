// Express App Object
const express = require("express");
const app = express();

const morgan = require("morgan");

// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res, next) => {
  res.send("test");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  if (err.isOperational) {
    const { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode).json({
      status: "error",
      message: message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Something went Wrong!",
  });
});

module.exports = app;
