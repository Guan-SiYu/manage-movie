const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // fs.mkdir('./image', (err) => {
    //   if (err) console.log('图片即将保存至./image目录下....');
    // });
    cb(null, './image');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
module.exports = upload;
