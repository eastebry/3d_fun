var CLIENT_UPDATE_INTERVAL = 30;
var mySocketId;

var socket = io.connect('http://localhost:8000');
var roomId = 'default';
if (getQueryStrings()['room']) {
    roomId = getQueryStrings()['room'];
}
socket.emit('room', {room: roomId});

socket.on('myId', function(data) {
    mySocketId = data;
})

socket.on('serverUpdate', function(data) {
    console.log(data);
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
