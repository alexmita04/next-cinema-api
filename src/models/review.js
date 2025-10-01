const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "The review author is mandatory and cannot be empty."],
    },
    movie: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
      required: [true, "The review movie is mandatory and cannot be empty."],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: [true, "The review rating is mandatory and cannot be empty."],
    },
    body: {
      type: String,
      required: [true, "The review body is mandatory and cannot be empty."],
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
