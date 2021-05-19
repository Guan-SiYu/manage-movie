const express = require('express'),
  router = express.Router();
const fs = require('fs');
const upload = require('../middleware/imgstorage');
const { PhotoClass } = require('../models/photo');

const OSS = require('ali-oss');
const { result } = require('lodash');
const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI5tNaLX522Mvm74pozVBo',
  accessKeySecret: 'mrFLtcT7j2lO8Sk8uhKjjetm9wiiCx',
  bucket: 'vidly',
});

//多文件上传 input[file]的multipl='multiple'
router.post('/uploads', upload.array('imageFile', 5), (req, res, next) => {});

//单文件上传：input[file]的 multiple != "multiple"
router.post('/upload', upload.single('imageFile'), async (req, res, next) => {
  const filename = req.file.filename;
  let result;
  try {
    result = await client.put('test/' + filename, './image/' + filename);
    console.log('oss result:', result); //在此处记录 url name 等信息
  } catch (err) {
    console.log('oos error');
    console.log(err);
  }
  res.send({
    info: '保存成功',
    url: result.url,
    etag: result.res.headers.etag,
    other: `server:${result.res.headers.server};  
	date:${result.res.headers.date};  
	aborted:${result.res.aborted};rt:${result.res.rt};  
	remoteAddress:${result.res.remoteAddress}`,
  });
});
//   const path = __dirname.match(/.+(?=\/routes)/).join() + '/' + req.file.path;
//   let new_photo = await PhotoClass.findOne({ path });
//   if (new_photo) return res.status(400).send({ info: '已有此图片' });
//   new_photo = new PhotoClass({
//     destination: req.file.destination,
//     filename: req.file.filename,
//     path,
//   });
//   await new_photo.save();
//   console.log(req.file);
router.post('/show', (req, res) => {
  res.download(`${req.body.destination}/${req.body.filename}`, (err) => {
    if (err) console.log('图片加载失败');
    console.log('图片加载成功');
  });
});

router.post('/delete', (req, res) => {
  console.log(req.body);
  fs.unlink(`${req.body.destination}/${req.body.filename}`, (err) => {
    if (err) throw err;
    console.log('文件删除成功!');
    res.send('文件删除成功');
  });
});
module.exports = router;
