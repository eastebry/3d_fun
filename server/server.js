var express = require('express');
var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);

SERVER_UPDATE_INTERVAL = 50;

var clientSockets = [];
var gameState = {};

server.use(express.static(__dirname + '/../'));
httpServer.listen(8000);

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('init', function (data) {
        console.log(data);
    });
    socket.on('clientUpdate', function(data) {
        gameState[socket.id] = data
    });
});

setInterval(function() {
    
}, SERVER_UPDATE_INTERVAL);
