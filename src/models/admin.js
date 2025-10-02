const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    cinema: {
      type: mongoose.Types.ObjectId,
      ref: "Cinema",
      required: [true, "The admin cinema is mandatory and cannot be empty."],
    },
    username: {
      type: String,
      required: [true, "The admin username is mandatory and cannot be empty."],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "The admin password is mandatory and cannot be empty."],
      select: false,
    },
    email: {
      type: String,
      required: [true, "The admin email is mandatory and cannot be empty."],
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
