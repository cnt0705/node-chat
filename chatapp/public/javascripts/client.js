$(function() {

  // ソケットに接続する
  var socket = io();

  var userName = $('#username').text();
  var $timeline = $('#timeline');
  var $msgForm = $('#message');
  var $loginBtn = $('#login');
  var $flash = $('#flash');

  // すべてのメッセージを表示する
  socket.on('all messages', function(data) {
    if(!data.length || !$timeline.length) return;
    data.forEach(function(doc) {
      addMessage(doc)
    });
  });

  // 誰かがログインしたときに通知する
  socket.on('user joined', function(name) {
    $flash.text(name + ' joined!');
    $flash.fadeIn('slow', function() {
      $(this).delay(3000).fadeOut('slow');
    });
  });

  // 新しい投稿を表示する
  socket.on('new message', function(data) {
    addMessage(data)
  });

  // ログインしたとき
  $loginBtn.on('click', function() {
    var name = $('#name').val();
    socket.emit('login', name);
    window.location.href = '/chat/' + name;
  });

  // 投稿するとき
  $msgForm.keypress(function(e) {
    if(e.which !== 13) return;
    var val = $(this).val();
    $(this).val('');
    socket.emit('post message', {
      name: userName,
      message: val,
      time: new Date()
    });
  });

  var addMessage = function(data) {
    $timeline.prepend('<li><span>' + data.name + '</span><span>' + data.message + '</span><span>' + timeFormat(data.time) +'</span></li>')
  };

  var timeFormat = function(time) {
    var t = new Date(time)
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
    return h + ':' + m + ':' + s;
  }
});
