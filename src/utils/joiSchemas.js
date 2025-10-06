const Joi = require("joi");

exports.reviewSchema = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
  body: Joi.string().required(),
});
