const express = require('express'),
  router = express.Router();
const _ = require('lodash');

const { MovieClass, validateMovie } = require('../models/movie');
const { CollectionClass } = require('../models/collection');
const authorization = require('../middleware/authorization');

router.post('/show', authorization, async (req, res) => {
  let allMovie = await MovieClass.find();
  let userCollected = await CollectionClass.find({
    user: req.pld_user._id,
  });
  userCollected = userCollected.map((item) => String(item.movie));
  allMovie.forEach((movie) => {
    let isCollect = userCollected.includes(String(movie._id));
    movie.isCollect = isCollect;
    console.log(isCollect);
  });
  res.send(allMovie);
});

router.post('/add', async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let new_movie = await MovieClass.findOne({ name: req.body.name });
  if (new_movie) return res.status(400).send('已有此电影');
  new_movie = new MovieClass(req.body);
  await new_movie.save();
  res.send(_.pick(new_movie, ['name', 'date']));
});

router.post('/coverphoto', async (req, res) => {
  const movie = await MovieClass.findById(req.body.movie_id)
    .populate('coverPhoto', 'destination filename -_id')
    .select('coverPhoto name -_id');
  const cover_photo = movie.coverPhoto;
  cover_photo
    ? res.download(`${cover_photo.destination}/${cover_photo.filename}`)
    : res.send({ errFlag: true, errInfo: '该条记录没有封面' });
});

router.post('/collect', authorization, async (req, res) => {
  if (req.body.action) {
    let new_collection = new CollectionClass({
      user: req.pld_user._id,
      movie: req.body.movie_id,
    });
    await new_collection.save();
    res.send('收藏成功');
  } else {
    const deleteResult = await CollectionClass.deleteOne({
      movie: req.body.movie_id,
    });
    console.log(deleteResult);
    res.send('取消收藏成功');
  }
});

router.get('/collection', authorization, async (req, res) => {
  const userCollections = await CollectionClass.find({
    user: req.pld_user._id,
  }).populate('movie');
  res.send(userCollections);
});

module.exports = router;
