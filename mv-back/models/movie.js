const Joi = require('joi');
const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    required: true,
    unique: true,
  },
  director: String,
  performers: Array,
  score: {
    type: Number,
    required: true,
  },
  date: { type: Date, default: Date.now },
  genre: String,
  region: String,
  isCollect: Boolean,
  coverPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
  },
});

const MovieClass = mongoose.model('Movie', MovieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    name: Joi.string().required(),
    director: Joi.string(),
    performers: Joi.array(),
    score: Joi.number().required(),
    date: Joi.date(),
    genre: Joi.string(),
    region: Joi.string(),
    coverPhoto: Joi.string(),
  });
  return schema.validate(movie);
}

exports.MovieClass = MovieClass;
exports.validateMovie = validateMovie;
