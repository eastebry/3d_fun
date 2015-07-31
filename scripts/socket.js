var CLIENT_UPDATE_INTERVAL = 30;
var mySocketId;
var myHealth = 100;
var opponents = {};
var socket = io.connect(window.location.origin);
var roomId = 'default';
if (getQueryStrings()['room']) {
    roomId = getQueryStrings()['room'];
}
socket.emit('room', {room: roomId});

socket.on('myId', function(data) {
    mySocketId = data;
})

socket.on('health', function(data) {
    console.log("my current health " + data);
    myHealth = data;
    localPlayer.hit();
    if (myHealth <= 0) {
        localPlayer.die()
    }
})

socket.on('playerDown', function(data) {
    // opponents[data].fall();
})

socket.on('serverUpdate', function(data) {
    // console.log(data);
    if (!scene.zombies) {
        scene.zombies = opponents;
    }
    for (var playerId in data) {
        var state = data[playerId];
        if (playerId === mySocketId) {
            // this is me!!
        }
        else {
            var zombie = opponents[playerId];
            if (!zombie) {
                zombie = new Zombie(scene);
                if (!scene.zombies) {
                    scene.zombies = [];
                }
                opponents[playerId] = zombie;
                zombie.zmesh.playerId = playerId;
            }

            zombie.zmesh.position.x = state.position[0];
            zombie.zmesh.position.y = state.position[1];
            zombie.zmesh.position.z = state.position[2];

            zombie.zmesh.rotation.x = state.rotation[0];
            zombie.zmesh.rotation.y = state.rotation[1];
            zombie.zmesh.rotation.z = state.rotation[2];
        }
    }

    for (var existingPlayerId in opponents) {
        if (!data[existingPlayerId]) {
            // disconnected player
            opponents[existingPlayerId].zmesh.dispose();
            delete opponents[existingPlayerId];
        }
    }
})

function getQueryStrings() {
    var assoc  = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for(var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }

    return assoc;
}

setInterval(function() {
    var camera = localPlayer.camera;
    socket.emit('clientUpdate', {
        position: [
            camera.position.x,
            camera.position.y,
            camera.position.z,
        ],
        rotation: [
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z,
        ],
    })
}, CLIENT_UPDATE_INTERVAL);
