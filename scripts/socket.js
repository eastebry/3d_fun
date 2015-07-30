var socket = io.connect('http://localhost:8000');
var roomId = 'default';
if (getQueryStrings()['room']) {
  roomId = getQueryStrings()['room'];
}
socket.emit('room', {room: roomId});
socket.on('serverUpdate', function(data) {
  // update player
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
// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('my other event', { my: 'data' });
// });
