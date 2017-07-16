$(function() {

  var socket = io('http://localhost:3000');

  var userName = $('#username').text();
  var $timeline = $('#timeline');
  var $msgForm = $('#message');
  var $loginBtn = $('#login');
  var $flash = $('#flash');

  $loginBtn.on('click', function() {
    var name = $('#name').val();
    socket.emit('connected', name);
    window.location.href = '/chat/' + name;
  });

  $msgForm.keypress(function(e) {
    if(e.which !== 13) return;
    var val = $(this).val();
    $(this).val('');
    socket.emit('post message', { name: userName, message: val});
  });

  socket.on('user joined', function(name) {
    $flash.text(name + ' joined!');
    $flash.fadeIn('slow', function() {
      $(this).delay(3000).fadeOut('slow');
    });
  });

  socket.on('new message', function(data) {
    var time = getTime();
    $timeline.prepend('<li><span>' + data.name + '</span><span>' + data.message + '</span><span>' + time +'</span></li>')
  });

  var getTime = function() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    return h + ':' + m + ':' + s;
  };
});
