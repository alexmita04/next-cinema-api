// Express App Object
const express = require("express");
const app = express();

// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
