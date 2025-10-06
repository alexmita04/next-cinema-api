const Joi = require("joi");
const { reviewSchema } = require("../utils/joiSchemas");
const ExpressError = require("../utils/ExpressError");

exports.validateReviewSchema = (req, res, next) => {
  try {
    Joi.assert(req.body, reviewSchema);
  } catch (err) {
    next(
      new ExpressError(
        `Review Validation Failed: ${err.details[0].message}`,
        400
      )
    );
  }

  next();
};
