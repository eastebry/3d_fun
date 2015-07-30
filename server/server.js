
// var server = require('http').Server(app);
var express = require('express');
var server = express();
var httpServer = require('http').Server(server);
var io = require('socket.io')(httpServer);

server.use(express.static(__dirname + '/../'));
httpServer.listen(8000);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
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
