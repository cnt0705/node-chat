var app = require('./app');
var debug = require('debug')('chatapp:server');
var http = require('http');
var socketio = require('socket.io');
var mongoose = require('mongoose');

var port = '3000'
app.set('port', port);

// ドキュメントのスキーマを決める
var Schema = new mongoose.Schema({
  name: String,
  message: String,
  time: Date
});
// DBに接続する
mongoose.connect('mongodb://localhost/nodechat');
// Postコンストラクタ
var Post = mongoose.model('post', Schema);

// HTTPサーバを生成する
var server = http.createServer(app);
// サーバをソケットに紐付ける
var io = socketio.listen(server);

// ブラウザからアクセスがあったとき
io.sockets.on('connection', function(socket) {
  // DBからすべてのドキュメントをとってくる
  Post.find(function(err, docs){
    socket.emit('all messages', docs);
  });

  // 誰かがログインしたとき
  socket.on('login', function(name) {
    socket.broadcast.emit('user joined', name);
  });

  // 投稿があったとき
  socket.on('post message', function(data) {
    io.sockets.emit('new message', data);

    var post = new Post();
    post.name = data.name;
    post.message = data.message;
    post.time = data.time;
    post.save(function(err) {
      if(err) { console.log(err); }
    });
  });
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
