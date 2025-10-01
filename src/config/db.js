const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.bzrhs0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected successfully.");
  })
  .catch((err) => {
    console.error("DB ERROR", err);
  });

module.exports = mongoose;
