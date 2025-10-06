const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_SECRET,
} = require("../middlewares/auth");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

exports.register = catchAsync(async (req, res, next) => {
  try {
    const { username, password, dateOfBirth, gender, phoneNumber, address } =
      req.body;
    if (!username || !password || !dateOfBirth || !phoneNumber || !address)
      // it will be replaced by a joi schmea soon
      return next(new ExpressError("All register fields are mandatory", 400));

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new ExpressError("The email is already used", 400));
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
