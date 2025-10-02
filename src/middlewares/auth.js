const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ExpressError("No Token Found", 401));
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return next(new ExpressError("User invalid", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ExpressError("Expired Token", 401));
    }
    return next(new ExpressError("Invalid Token", 401));
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return next(new ExpressError("You are not allowed to do this", 403));
  next();
};

const isUser = (req, res, next) => {
  if (req.user.isAdmin)
    return next(new ExpressError("You are not allowed to do this", 403));
  next();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticate,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  isAdmin,
  isUser,
};
