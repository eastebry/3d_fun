CLIENT_UPDATE_INTERVAL = 30;

var socket = io.connect('http://localhost:8000');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

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
