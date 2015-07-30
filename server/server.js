
// var server = require('http').Server(app);
var express = require('express');
var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);

server.use(express.static(__dirname + '/../'));
httpServer.listen(8000);

var socketRoomMap = {};
var roomList = [];

io.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });
  socket.on('room', function (data) {
    socket.join(data['room']);
    socketRoomMap[socket.id] = data['room'];
    // if new room
    // setInterval
  });

  socket.on('clientUpdate', function (data) {
    socket.broadcast.to(socketRoomMap[socket.id]).emit('serverUpdate', data);
  });
});
// serve
//
// app.get('/', function (req, res) {
//   res.sendfile('../index.html');
// });
//
// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
