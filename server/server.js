var express = require('express');
var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);

var SERVER_UPDATE_INTERVAL = 50;

server.use(express.static(__dirname + '/../'));
httpServer.listen(8001);

var socketRoomMap = {};
var roomState = {};
var roomHealthState = {};

io.on('connection', function(socket) {
    socket.emit('myId', socket.id);

    socket.on('message', function(data){
        console.log('global message: ' + data['message']);
        io.to(socketRoomMap[data['playerId']]).emit('message', data['message']);
    });

    socket.on('pistolshot', function(data){
        console.log(data);
        for (player in socketRoomMap) {
            io.to(socketRoomMap[player]).emit('pistolshot', data);
        }
    });
    
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

    socket.on('rocketLaunch', function(data) {
        for (player in socketRoomMap) {
            if (data['playerId'] != player) {
                io.to(socketRoomMap[player]).emit('rocketLaunch', data);
            }
        }
    });

    socket.on('hit', function(data) {
        var healthState = roomHealthState[socketRoomMap[socket.id]];
        var damage = 0;
        if (data['weapon'] === 'pistol') {
            damage = 40;
        }
        else if (data['weapon'] === 'mg') {
            damage = 20;
        }
        else if (data['weapon'] === 'rocket') {
            damage = data['damage'];
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

        for (player in socketRoomMap) {
            io.to(socketRoomMap[player]).emit('pistolhit', data);
        }
	
        io.to(data['id']).emit('health', healthState[data['id']]);
    });

    socket.on('disconnect', function() {
        var gameState = roomState[socketRoomMap[socket.id]];
        var healthState = roomHealthState[socketRoomMap[socket.id]];
        if (gameState) {
            delete gameState[socket.id];
            delete socketRoomMap[socket.id];
        }
    })
})
