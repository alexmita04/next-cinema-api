const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_SECRET,
} = require("../middlewares/auth");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Tickets = require("../models/ticket");
const Cinema = require("../models/cinema");
const Screening = require("../models/screening");
const Ticket = require("../models/ticket");
const utcDate = require("../utils/utcDate");

const normalizeToUTCMidnight = (date) => {
  const newDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  return newDate;
};

exports.register = catchAsync(async (req, res, next) => {
  try {
    const { username, password, dateOfBirth, gender, phoneNumber, address } =
      req.body;
    if (!username || !password || !dateOfBirth || !phoneNumber || !address)
      // it will be replaced by a joi schmea soon
      return next(new ExpressError("All register fields are mandatory", 400));

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new ExpressError("The username is already used", 400));
    }

    const newUser = new User({
      username,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
    });
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    newUser.refreshTokens.push({ token: refreshToken });
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: "success",
      data: {
        message: "Account created",
        accessToken,
        user: {
          id: newUser._id,
          username: newUser.username,
        },
      },
    });
  } catch (err) {
    return next(new ExpressError("Register Error", 500));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new ExpressError("All fields are mandatory", 400));
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return next(new ExpressError("Invalid Credentials", 401));
    }

    const validPassword = await user.comparePassword(password, user.password);
    if (!validPassword) {
      return next(new ExpressError("Invalid Credentials", 401));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: "success",
      data: {
        message: "Logged in",
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (err) {
    return next(new ExpressError("Login Error", 500));
  }
});

exports.refresh = catchAsync(async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new ExpressError("All fields are mandatory"));
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findOne({
      _id: decoded.userId,
      "refreshTokens.token": refreshToken,
    });

    if (!user) {
      return next(new ExpressError("Invalid Refresh Token", 401));
    }

    const newAccessToken = generateAccessToken(user._id);

    res.json({
      status: "success",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (err) {
    return next(new ExpressError("Invalid Refresh Token"));
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { refreshTokens: { token: refreshToken } },
      },
      { new: true }
    );

    res.clearCookie("refreshToken");

    res.json({
      status: "success",
      data: {
        message: "Successfully logged out!",
      },
    });
  } catch (err) {
    return next(new ExpressError("Logout Error"));
  }
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const {
    username,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    createdAt,
    isAdmin,
  } = req.user;

  res.json({
    status: "success",
    data: {
      profileInformation: {
        username,
        dateOfBirth,
        gender,
        phoneNumber,
        address,
        createdAt,
        isAdmin,
      },
    },
  });
});

exports.getProfileTickets = catchAsync(async (req, res, next) => {
  const userTickets = await Tickets.find({ customer: req.user._id }).populate(
    "screening"
  );

  res.json({
    status: "success",
    data: {
      tickets: userTickets,
      ticketsCounter: userTickets.length,
    },
  });
});

exports.getReportsSales = catchAsync(async (req, res, next) => {
  let { date } = req.query;

  if (!date) date = normalizeToUTCMidnight(new Date(Date.now()));
  else date = utcDate(date);

  const adminId = req.user._id;

  const cinema = await Cinema.find({ admin: adminId }).populate("auditoriums");

  if (!cinema) {
    return next(new ExpressError("No cinema found", 404));
  }

  const screenings = await Screening.find({ cinema: cinema._id, date });

  const allTickets = [];
  let totalSales = 0;
  for (const screening of screenings) {
    const tickets = await Ticket.find({ screening: screening._id });

    for (const ticket of tickets) {
      totalSales += ticket.totalPrice / 100;
    }

    allTickets.push({ screeningId: screening._id, tickets });
  }

  res.json({
    status: "success",
    data: {
      cinema,
      screenings,
      allTickets,
      totalSales,
    },
  });
});
