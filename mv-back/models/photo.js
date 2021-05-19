const mongoose = require('mongoose');
const PhotoClass = mongoose.model(
  'Photo',
  new mongoose.Schema({
    filename: String,
    destination: String,
    path: String,
  }),
);
exports.PhotoClass = PhotoClass;
