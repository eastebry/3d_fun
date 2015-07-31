var CLIENT_UPDATE_INTERVAL = 30;
var mySocketId;
var myHealth = 100;
var opponents = {};
var server =  "10.255.54.2:8000";
server =  window.location.href;
var socket = io.connect(server);
var roomId = 'default';

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

if (getQueryStrings()['room']) {
    roomId = getQueryStrings()['room'];
}
socket.emit('room', {room: roomId});
socket.on('myId', function(data) {
    mySocketId = data;
})

socket.on('health', function(data) {
    myHealth = data;
    localPlayer.hit();
    if (myHealth <= 0) {
        localPlayer.die()
    }
    $("#health").text(Math.round(myHealth)+"%");
})
socket.on('message', function(message){
    $("#messages").append(escapeHtml(message) + "\n");
})

socket.on('playerDown', function(data) {
    // opponents[data].fall();
})

socket.on('rocketLaunch', function(data) {
    var pick = new BABYLON.Vector3(data['pickpos'][0], data['pickpos'][1], data['pickpos'][2]);
    var cam = new BABYLON.Vector3(data['campos'][0], data['campos'][1], data['campos'][2]);
    var projectile = new RocketProjectile(scene, cam, pick);
    playSound('rocket', cam);
})

socket.on("pistolshot", function(event) {
    showSparks(scene, event.source, event.dest, event.id);
});

socket.on('pistolhit', function(event) {
    showBlood(scene, event.source, event.dest, event.id);
});

socket.on('serverUpdate', function(data) {
    if (!scene.zombies) {
        scene.zombies = opponents;
    }
    for (var playerId in data) {
        var state = data[playerId];
        if (playerId === mySocketId) {
            // this is me!!
        }
        else {
            var newPos = new BABYLON.Vector3(state.position[0],
                                             state.position[1]-1.25,
                                             state.position[2])
            var marine = opponents[playerId];
            if (!marine) {
                marine = new Marine(scene, newPos);
		marine.setName(state.name || "[ Player ]");
                if (!scene.marines) {
                    scene.marines = [];
                }
                opponents[playerId] = marine;
                marine.hitbox.playerId = playerId;
            } else {
                var movedist = BABYLON.Vector3.Distance(marine.sprite.position, newPos);
                marine.running = (movedist > 0);
            }
            marine.setPosition(newPos);
            marine.setRotation(state.rotation[1]);
            /*zombie.zmesh.position.x = state.position[0];
            zombie.zmesh.position.y = state.position[1];
            zombie.zmesh.position.z = state.position[2];

            zombie.zmesh.rotation.x = state.rotation[0];
            zombie.zmesh.rotation.y = state.rotation[1];
            zombie.zmesh.rotation.z = state.rotation[2];*/
        }
    }

    for (var existingPlayerId in opponents) {
        if (!data[existingPlayerId]) {
            // disconnected player
            opponents[existingPlayerId].sprite.dispose();
            opponents[existingPlayerId].hitbox.dispose();
            opponents[existingPlayerId].text.mesh.dispose();	    
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
    if (!localPlayer) return console.error("No local player");
    var camera = localPlayer.camera;
    var emit_data= {
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
        rockets: [],
	name: playerName
    };
    socket.emit('clientUpdate', emit_data);
}, CLIENT_UPDATE_INTERVAL);
