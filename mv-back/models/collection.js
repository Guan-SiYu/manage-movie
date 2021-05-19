const mongoose = require('mongoose');
const Joi = require('joi');

const CollectionClass = mongoose.model(
  'Collection',
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },
  }),
);

exports.CollectionClass = CollectionClass;
