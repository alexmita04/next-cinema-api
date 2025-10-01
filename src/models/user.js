const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "The user username is mandatory and cannot be empty."],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "The user password is mandatory and cannot be empty."],
      select: false,
    },
    dateOfBirth: {
      type: Date,
      required: [
        true,
        "The user date of birth is mandatory and cannot be empty.",
      ],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Prefer not to say"],
      required: [true, "The user gender is mandatory and cannot be empty."],
    },
    phoneNumber: {
      type: String,
      required: [
        true,
        "The user phone number is mandatory and cannot be empty.",
      ],
    },
    address: {
      type: String,
      required: [true, "The user address is mandatory and cannot be empty."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;

  const today = new Date();
  const birthDate = new Date(this.birthDate);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDif = today.getMonth() - birthDate.getMonth();

  if (monthDif < 0 || (monthDif === 0 && today.getDate() < birthDate.getDate()))
    age--;

  return age;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
