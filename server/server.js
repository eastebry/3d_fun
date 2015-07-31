var express = require('express');
var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);

var SERVER_UPDATE_INTERVAL = 50;

server.use(express.static(__dirname + '/../'));
httpServer.listen(8000);

var socketRoomMap = {};
var roomState = {};
var roomHealthState = {};

io.on('connection', function(socket) {
    socket.emit('myId', socket.id);

    socket.on('room', function(data) {
        var roomId = data['room'];
        socket.join(roomId);
        socketRoomMap[socket.id] = roomId;

        if (!roomState[roomId]) {
            roomState[roomId] = {};
            roomHealthState[roomId] = {};
            setInterval(function() {
                io.to(roomId).emit('serverUpdate', roomState[roomId]);
            }, SERVER_UPDATE_INTERVAL);
        }
    });

    socket.on('clientUpdate', function(data) {
        var gameState = roomState[socketRoomMap[socket.id]];
        if (gameState) {
            gameState[socket.id] = data;
        }
    });

    socket.on('hit', function(data) {
        var healthState = roomHealthState[socketRoomMap[socket.id]];
        var damage = 0;
        if (data['weapon'] === 'pistol') {
            damage = 40;
        }
        else {
            damage = 20;
        }
        if (healthState[data['id']]) {
            healthState[data['id']] -= damage;
        }
        else {
            if (healthState[data['id']] === 0) {
                io.to(socketRoomMap[socket.id]).emit('playerDown', data['id']);
            }
            healthState[data['id']] = 100;
            healthState[data['id']] -= damage;
        }
        io.to(data['id']).emit('health', healthState[data['id']]);
    });

    socket.on('disconnect', function() {
        console.log("delete a player");
        var gameState = roomState[socketRoomMap[socket.id]];
        var healthState = roomHealthState[socketRoomMap[socket.id]];
        if (gameState) {
            delete gameState[socket.id];
            delete socketRoomMap[socket.id];
        }
    })
})
