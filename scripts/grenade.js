function Grenade(name, size, scene) {
    this.name = name;
    this.size = size;
    this.scene = scene;
    this.active = false;
    this.pickDist = 999999;
    // Variables for moving the gun

    var _this = this;
    this.nextFire = 0;
}

inheritsFrom(Grenade, Weapon);

Grenade.prototype.fire = function() {
    if (new Date().getTime() < this.nextFire) {
        return;
    }
    this.nextFire = new Date().getTime() + 300;
    var pick = this.getPick();
    if (pick == null) {
        // wat
        return;
    }
    var projectile = new grenadeProjectile(this.scene, this.scene.cameras[0].position, pick.pickedPoint, false);
    //var projectile_data = SerializeProjectile(this.scene.cameras[0].position, pick.pickedPoint);
    //socket.emit("rocketLaunch", projectile_data);
    //playSound('rocket', this.scene.cameras[0].position);
}

function grenadeProjectile(scene, position, pickpos, mini) {
    this.mini = mini;
    this.active = true;
    this.id = Math.random().toString(36).substring(7);
    this.scene = scene;
    scene.updateables.push(this);
    //this.speed = new BABYLON.Vector3(2, 2, 0);
    if (!mini) {
        this.speed = pickpos.subtract(localPlayer.camera.position);
        this.speed.normalize();
        this.speed = this.speed.scale(2);
    }
    else {
        this.speed = new BABYLON.Vector3((Math.random()*6)-3, Math.random()*5+10, (Math.random()*6)-3);
        this.speed.normalize();
        this.speed = this.speed.scale(.1);
    }
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

grenadeProjectile.prototype.update = function() {
    if (!this.active) {
        return;
    }
    var newPos = this.mesh.position.add(this.speed);
    this.speed.y -= .01;
    if (this.mini) {
        this.speed.y -= .03;
    }
    var _this = this;
    this.mesh.position = newPos;
    var dist = pickDist(this.mesh, this.speed);
    // Explode if dist <2 or if the distance suddenly increased and it was close
    if (dist < 10) { // || (dist < this.pickDist && dist < this.pickDist-dist)) {
        this.speed.y = 0;
        this.speed.x = 0;
        this.speed.z = 0;
        if (this.mini) {
            this.explode();
        }
        else {
            setTimeout(function () {
                _this.explode();
            }, 1000);
            this.active = false;
        }
    }
    this.pickDist = dist;
}

function pickDist(mesh, dir) {
    dir.normalize();
    mesh.isPickable = false;
    var ray = new BABYLON.Ray(mesh.position, dir);
    var pick = scene.pickWithRay(ray, null);
    if (pick != null) {
        return pick.distance;
    }
    return 999999;
}

var _rocketmesh = null;

grenadeProjectile.prototype.launchMini = function() {
    var projectile = new grenadeProjectile(this.scene, this.mesh.position, this.mesh.position, true);
}
    

grenadeProjectile.prototype.explode = function() {
    this.mesh.position.y += 1;
    var _this = this;
    if (!this.mini) {
        for (var i=0;i<10;i++) {
            setTimeout(function() {
                _this.launchMini();
            }, Math.random()*500);
        }
        this.removeobj()
    }
    else {
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
        this.removeobj()
        explosionDamage(explosion.position, 15, 150);
    }
}

grenadeProjectile.prototype.removeobj = function() {
    var thisIndex = this.scene.updateables.indexOf(this);
    this.scene.updateables.splice(thisIndex, 1);
    var mIndex  = this.scene.meshes.indexOf(this.mesh);
    this.scene.meshes.splice(mIndex, 1);
    this.mesh.setEnabled(false);
}
