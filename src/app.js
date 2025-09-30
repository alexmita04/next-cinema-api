// Express App Object
const express = require("express");
const app = express();

const morgan = require("morgan");

// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("test");
});

module.exports = app;
