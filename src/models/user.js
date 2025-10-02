const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

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
    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 60 * 60 * 24 * 7, // 7 days
          select: false,
        },
      },
    ],
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
    timestamps: true,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
