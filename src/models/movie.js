const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    title: {
      type: String,
      required: [true, "The movie title is mandatory and cannot be empty."],
      unique: true,
    },
    description: {
      type: String,
      required: [
        true,
        "The movie description is mandatory and cannot be empty.",
      ],
    },
    slug: {
      type: String,
      required: [true, "The movie slug is mandatory and cannot be empty."],
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, "The movie duration is mandatory and cannot be empty."],
      min: 0,
    },
    releaseDate: {
      type: Date,
      required: [
        true,
        "The movie release date is mandatory and cannot be empty.",
      ],
    },
    genres: {
      type: [String],
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "SF",
        "Fantasy",
        "Thriller",
        "Romance",
        "Adventure",
        "Animation",
        "Documentary",
      ],
      required: [true, "The movie genres is mandatory and cannot be empty."],
    },
    cast: [
      {
        name: {
          type: String,
          required: [
            true,
            "The movie cast (name) is mandatory and cannot be empty.",
          ],
        },
        characterName: {
          type: String,
          required: [
            true,
            "The movie cast (character name) is mandatory and cannot be empty.",
          ],
        },
      },
    ],
    director: {
      type: String,
      required: [true, "The movie director is mandatory and cannot be empty."],
    },
    production: {
      type: String,
      required: [
        true,
        "The movie production is mandatory and cannot be empty.",
      ],
    },
    distribution: {
      type: String,
      required: [
        true,
        "The movie distribution is mandatory and cannot be empty.",
      ],
    },
    coverImage: {
      type: String,
      required: [
        true,
        "The movie cover image is mandatory and cannot be empty.",
      ],
    },
    trailer: {
      type: String,
      required: [true, "The movie trailer is mandatory and cannot be empty."],
    },
    marketing: {
      featured: {
        type: Boolean,
      },
      priority: {
        type: number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
