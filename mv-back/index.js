const cors = require('cors');
const express = require('express'),
  app = express();
//   cors = require('express-cors');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const register = require('./routes/register'),
  login = require('./routes/login'),
  me = require('./routes/me'),
  movie = require('./routes/movie'),
  photo = require('./routes/photo');

const config = require('config');
if (!config.get('jwtPrivateKey')) {
  console.error('严重错误:环境变量vidly_jwtkey私钥没设置');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/vidly', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('已连接数据库'))
  .catch((err) => console.error('不能连接数据库'));

/*-- 全局middleware --*/
app.use(cors());
app.use(express.json());

/*-- 路由 --*/

app.use('/user/register', register);
app.use('/user/login', login);
app.use('/user/me', me);
app.use('/movie', movie);
app.use('/photo', photo);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`正在监听${port}端口`));
