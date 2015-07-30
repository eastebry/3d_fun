var express = require('express');
var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);

SERVER_UPDATE_INTERVAL = 50;

var clientSockets = [];
var gameState = {};

server.use(express.static(__dirname + '/../'));
httpServer.listen(8000);

var socketRoomMap = {};
var roomState = {};

io.on('connection', function (socket) {
  socket.on('room', function (data) {
    var roomId = data['room'];
    socket.join(roomId);
    socketRoomMap[socket.id] = roomId;

    if (!roomState[roomId]) {
      // if it is a new room
      roomState[roomId] = {};
      setInterval(function() {
        io.to(roomId).emit('serverUpdate', roomState[roomId]):
      }, SERVER_UPDATE_INTERVAL);
    }
  });

  socket.on('clientUpdate', function (data) {
      var gameState = roomState[socketRoomMap[socket.id]];
      gameState[socket.id] = data;
  });

});
