const mongoose = require("mongoose");
const { Schema } = mongoose;

const screeningSchema = new Schema(
  {
    auditorium: {
      type: mongoose.Types.ObjectId,
      ref: "Auditorium",
      required: [
        true,
        "The screening auditorium is mandatory and cannot be empty.",
      ],
    },
    movie: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
      required: [true, "The screening movie is mandatory and cannot be empty."],
    },
    cinema: {
      type: mongoose.Types.ObjectId,
      ref: "Cinema",
      required: [
        true,
        "The screening cinema is mandatory and cannot be empty.",
      ],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    startTime: {
      type: Number,
      required: [
        true,
        "The screening start time is mandatory and cannot be empty.",
      ],
    },
    type: {
      type: String,
      enum: ["Scheduled", "Recurring"],
      default: "Scheduled",
    },
    pricing: {
      type: Number,
      required: [true, "The screening price is mandatory and cannot be empty."],
      min: 0,
    },
    language: {
      type: String,
      required: [
        true,
        "The screening language is mandatory and cannot be empty.",
      ],
    },
    subtitle: {
      type: String,
      required: [
        true,
        "The screening subtitle is mandatory and cannot be empty.",
      ],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Screening = mongoose.model("Screening", screeningSchema);

module.exports = Screening;
