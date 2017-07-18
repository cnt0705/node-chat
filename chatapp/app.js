var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// ルーターモジュールをインポートする
var index = require('./routes/index');
var chat = require('./routes/chat');

var app = express();

// テンプレートが格納されているディレクトリを指定する
app.set('views', path.join(__dirname, 'views'));
// 利用するテンプレートエンジンを指定する
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ルーターモジュールを指定したパスにマウントする
app.use('/', index);
app.use('/chat', chat);

// エラーハンドリング
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
