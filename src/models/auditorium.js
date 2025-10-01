const mongoose = require("mongoose");
const { Schema } = mongoose;

const auditoriumSchema = new Schmea({
  number: {
    type: Number,
    required: [true, "The auditorium number is mandatory and cannot be empty."],
  },
  cinema: {
    type: mongoose.Types.ObjectId,
    ref: "Cinema",
    required: [true, "The auditorium number is mandatory and cannot be empty."],
  },
  capacity: {
    type: Number,
    required: [
      true,
      "The auditorium capacity is mandatory and cannot be empty.",
    ],
  },
  type: {
    type: String,
    enum: ["Standard", "4dx", "IMAX"],
    required: [true, "The auditorium type is mandatory and cannot be empty."],
  },
  seatLayout: {
    rows: {
      type: Number,
      min: 0,
      required: [
        true,
        "The auditorium seat layout (row) is mandatory and cannot be empty.",
      ],
    },
    seatsPerRow: {
      type: Number,
      min: 0,
      required: [
        true,
        "The auditorium seat layout (seats per row) is mandatory and cannot be empty.",
      ],
    },
  },
  screenSize: {
    type: String,
    required: [
      true,
      "The auditorium screen size is mandatory and cannot be empty.",
    ],
  },
  soundSystem: {
    type: String,
    required: [
      true,
      "The auditorium sound system is mandatory and cannot be empty.",
    ],
  },
  projection: {
    type: String,
    required: [
      true,
      "The auditorium projection is mandatory and cannot be empty.",
    ],
  },
});

auditoriumSchema.index({ number: 1, cinema: 1 }, { unique: true });

const Auditorium = mongoose.model("Auditorium", auditoriumSchema);

module.exports = Auditorium;
