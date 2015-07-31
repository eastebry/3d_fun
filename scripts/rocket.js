function Rocket(name, size, scene) {
    this.name = name;
    this.size = size;
    this.scene = scene;
    this.active = false;
    // Variables for moving the gun

    var _this = this;
    this.nextFire = 0;
}

inheritsFrom(Rocket, Weapon);

Rocket.prototype.fire = function() {
    if (new Date().getTime() < this.nextFire) {
        return;
    }
    this.nextFire = new Date().getTime() + 2000;
    var pick = this.getPick();
    if (pick == null) {
        // wat
        return;
    }
    var projectile = new RocketProjectile(this.scene, this.scene.cameras[0].position, pick.pickedPoint);
    var projectile_data = SerializeProjectile(this.scene.cameras[0].position, pick.pickedPoint);
    socket.emit("rocketLaunch", projectile_data);
    playSound('rocket', this.scene.cameras[0].position);
}

function SerializeProjectile(cameraPosition, pick){
    var data = {
        playerId: mySocketId,
        campos: [cameraPosition.x, cameraPosition.y, cameraPosition.z],
        pickpos: [pick.x, pick.y, pick.z]
    }
    return data;
}

function RocketProjectile(scene, position, pickpos) {
    this.id = Math.random().toString(36).substring(7);
    this.scene = scene;
    scene.updateables.push(this);
    this.speed = 10;
    var rocket = _rocketmesh.clone(this.id);
    rocket.id = this.id;
    rocket.rotation = localPlayer.camera.rotation
    this.mesh = rocket;
    rocket.position.copyFrom(position);
    this.endPos = pickpos.clone();
    this.originalPos = rocket.position.clone();
    var dist = BABYLON.Vector3.Distance(this.mesh.position, this.endPos);
    this.timeToNextPos = dist / this.speed * 100;
    this.startTime = new Date().getTime();
    this.endTime = this.startTime + this.timeToNextPos;
}

RocketProjectile.prototype.update = function() {
    var movedRatio = (new Date().getTime() - this.startTime) / (this.endTime - this.startTime);
    var newPos = new BABYLON.Vector3.Lerp(this.originalPos, this.endPos, movedRatio);
    this.mesh.position = newPos;
    if (movedRatio > .95) {
        this.explode();
    }
}

var _rocketmesh = null;

RocketProjectile.prototype.explode = function() {
    playSound('bomb', this.mesh.position);
    socket.emit('rocket_explode', {
        id: mySocketId,
        rocket_id: this.id
    });
    var spriteManagerExplosion = new BABYLON.SpriteManager('explosionManager', 'img/explosion-sprite.png', 2000, 64, scene);
    var explosion = new BABYLON.Sprite('explosion', spriteManagerExplosion);
    explosion.position = this.mesh.position.clone(); 
    explosion.position.y += 3;
    explosion.playAnimation(0,25,true,35);
    explosion.size = 16;
    setTimeout(function () {
        explosion.dispose();
    }, 35*25);
    var thisIndex = this.scene.updateables.indexOf(this);
    this.scene.updateables.splice(thisIndex, 1);
    var mIndex  = this.scene.meshes.indexOf(this.mesh);
    this.scene.meshes.splice(mIndex, 1);
    explosionDamage(explosion.position, 15, 150);
}

function explosionDamage(position, radius, damage) {
    for (opponent in opponents) {
        var distance = BABYLON.Vector3.Distance(position, opponents[opponent].sprite.position);
        distance = Math.max(0, radius - distance);
        if (distance > 0) {
            var multiplier = distance / radius;
            var damage = damage * multiplier;
            var hit_data = {
		damage: damage,
		playerId: mySocketId,
		id: opponent,
		weapon: 'rocket',
		source: localPlayer.camera.position,
		dest: position
            }
            socket.emit('hit', hit_data);
        }
    }
    // Self damage
    var distance = BABYLON.Vector3.Distance(position, this.scene.cameras[0].position);
    distance = Math.max(0, radius - distance);
    if (distance > 0) {
        var multiplier = distance / radius;
        var damage = damage * multiplier;
        console.log(damage);
        var hit_data = {
           damage: damage,
           playerId: mySocketId,
           id: mySocketId,
           weapon: 'rocket',
        }
        socket.emit('hit', hit_data);
    }
    
}
