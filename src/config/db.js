const mongoose = require("mongoose");

const uri = process.env.DB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected successfully.");
  })
  .catch((err) => {
    console.error("DB ERROR", err);
  });

module.exports = mongoose;
