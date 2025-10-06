const Joi = require("joi");

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "SF",
  "Fantasy",
  "Thriller",
  "Romance",
  "Adventure",
  "Animation",
  "Documentary",
];

exports.reviewSchema = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
  body: Joi.string().required(),
});

exports.movieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().min(0).required(),
  releaseDate: Joi.date().required(),
  genres: Joi.array()
    .items(Joi.string().valid(...genres))
    .required()
    .min(1),
  cast: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      characterName: Joi.string().required(),
    })
  ),
  director: Joi.string().required(),
  production: Joi.string().required(),
  distribution: Joi.string().required(),
  coverImage: Joi.string().required(),
  trailer: Joi.string().required(),
});
