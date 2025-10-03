const mongoose = require("mongoose");
const { Schema } = mongoose;

const cinemaSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The cinema name is mandatory and cannot be empty."],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "The cinema location is mandatory and cannot be empty."],
      trim: true,
    },
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "The cinema admin is mandatory and cannot be empty."],
    },
    auditoriums: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Auditorium",
        required: [
          true,
          "The cinema auditoriums are mandatory and cannot be empty.",
        ],
        validate: {
          validator: function (auditoriumsArr) {
            return (
              auditoriumsArr.length === new Set(auditoriumsArr.map(String)).size
            );
          },
        },
      },
    ],
    openingHour: {
      type: Number,
      required: [
        true,
        "The cinema opening hour is mandatory and cannot be empty.",
      ],
    },
    closingHour: {
      type: Number,
      required: [
        true,
        "The cinema closing hour is mandatory and cannot be empty.",
      ],
      validate: {
        validator: function (hour) {
          return hour > this.openingHour;
        },
        message: "Closing hour must be later than opening hour",
      },
    },
    email: {
      type: String,
      required: [true, "The cinema email is mandatory and cannot be empty."],
      unique: true,
    },
    parking: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Cinema = mongoose.model("Cinema", cinemaSchema);

module.exports = Cinema;
