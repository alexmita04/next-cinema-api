const mongoose = require("mongoose");
const { Schema } = mongoose;

const ticketSchema = new Schema(
  {
    screening: {
      type: mongoose.Types.ObjectId,
      ref: "Screening",
      required: [
        true,
        "The ticket screening is mandatory and cannot be empty.",
      ],
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "The ticket customer is mandatory and cannot be empty."],
    },
    seat: {
      row: {
        type: Number,
        required: [
          true,
          "The ticket seat (row) is mandatory and cannot be empty.",
        ],
      },
      number: {
        type: Number,
        required: [
          true,
          "The ticket seat (number) is mandatory and cannot be empty.",
        ],
      },
    },
    pricingCategory: {
      type: String,
      enum: ["standard", "student"],
      default: "standard",
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.index(
  {
    screening: 1,
    "seat.row": 1,
    "seat.number": 1,
  },
  {
    unique: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
