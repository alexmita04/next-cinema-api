const Joi = require("joi");
const { reviewSchema, movieSchema } = require("../utils/joiSchemas");
const ExpressError = require("../utils/ExpressError");

exports.validateReviewSchema = (req, res, next) => {
  try {
    Joi.assert(req.body, reviewSchema);

    next();
  } catch (err) {
    next(
      new ExpressError(
        `Review Validation Failed: ${err.details[0].message}`,
        400
      )
    );
  }
};

exports.validateMovieSchema = (req, res, next) => {
  try {
    Joi.assert(req.body, movieSchema);

    next();
  } catch (err) {
    next(
      new ExpressError(
        `Review Validation Failed: ${err.details[0].message}`,
        400
      )
    );
  }
};
