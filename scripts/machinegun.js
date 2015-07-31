function Machinegun(name, size, scene) {
    this.name = name;
    this.size = size;
    this.scene = scene;
    this.active = false;
    // Variables for moving the gun
    this.gunMovementX = 0;
    this.maxMachinegunMovementX = 1000;
    this.gunMovementY = 0;
    this.maxMachinegunMovementY = 200;

    // variables for animating
    this.index = 0;
    this.animation_direction = 1; //1 = up, -1 = down
    this.animation_speed = 150;
    this.shooting = false;

    this.impactSpriteManager = new BABYLON.SpriteManager("impactManager", "img/impact.png", 2000, 800, this.scene);

    var _this = this;
}

inheritsFrom(Machinegun, Weapon);

Machinegun.prototype.shootFrame = function(index){
    if (!this.active) {
        return;
    }
    this.index = index;
    var name  = "img/weapons/" + this.name + "_" + this.index+ ".png";
    $('#weapon').attr("src", name);
    var _this = this;
    if (index == 1) {
        setTimeout(function(){_this.shootFrame(0)}, this.animation_speed);
    }
}

Machinegun.prototype.registerGunMovement = function(){
    var _this = this;
    //TODO - too lazy to convert the moveMachinegun method to use jquery events
    document.getElementById('canvas').addEventListener('mousemove', function(evt){
        if (_this.active) { 
            _this.moveMachinegun(evt);
        }
    });
}

Machinegun.prototype.moveMachinegun = function(e) {
    this.gunMovementX += e.movementX;
    this.gunMovementY += e.movementY;
    if (this.gunMovementX <  -1 * this.maxMachinegunMovementX) this.gunMovementX = -1 * this.maxMachinegunMovementX;
    if (this.gunMovementX > this.maxMachinegunMovementX) this.gunMovementX = this.maxMachinegunMovementX;
    if (this.gunMovementY <  -1 * this.maxMachinegunMovementY) this.gunMovementY = -1 * this.maxMachinegunMovementY;
    if (this.gunMovementY > this.maxMachinegunMovementY) this.gunMovementY = this.maxMachinegunMovementY;

    var mouseX = this.gunMovementX;
    var mouseY = this.gunMovementY;
    var totalX = $('#container').width();
    var totalY = $('#container').height();
    var centerX = totalX / 2;
    var centerY = totalY / 2;
    var shiftX = centerX - mouseX;
    var shiftY = centerY - mouseY;

    /// TODO actually compute this
    var startX = -100;
    var startY = 100;
    var posX = startX - (shiftX/10);
    var posY = startY + (shiftY/10);
    posX += 125;
    posX = posX / 20;
    var left = 20 + Math.max(-8, Math.min(8, posX));

    $('#weapon').css({ 'left': left + '%', 'bottom': posY + 'px' });
};

function showSparks(scene, source, dest, playerid) {
    new Sparks(scene, dest);
    playSound('pistol', source);
};

Machinegun.prototype.fire = function() {
    if (!this.shooting) { 
        this.shooting = true;
        var _this = this;
        this.firebullet();
        this.shoot_int = setInterval(function() {
            _this.firebullet();
        }, 200);
    }
}

Machinegun.prototype.stop_fire = function() {
    clearInterval(this.shoot_int);
    this.shooting = false;
}

Machinegun.prototype.firebullet = function() {
	// send the hit event to server to reduce player's health
    if (!this.active) {
        this.stop_fire;
        return;
    }
    this.shootFrame(1);
	var pickResult = this.getPick();
	if (pickResult.pickedMesh && pickResult.pickedMesh.playerId) {
	    new BloodSpatter(this.scene, pickResult.pickedMesh);
	    socket.emit('hit', {
		id: pickResult.pickedMesh.playerId,
		weapon: 'mg',
		source: localPlayer.camera.position,
		dest: pickResult.pickedMesh.position
	    });
	}
	else if (pickResult.pickedPoint) {
	    new Sparks(this.scene, pickResult.pickedPoint);
	    var event = {
		id: pickResult.pickedMesh.playerId,
		weapon: 'mg',
		source: localPlayer.camera.position,
		dest: pickResult.pickedPoint,
	    };	    
	    showSparks(this.scene, event.source, event.dest, event.id);
	    socket.emit('pistolshot', event);
	}
    addRecoil();
};

function addRecoil() {
    var cam = scene.cameras[0];
    cam.rotation.y += (Math.random()*.03) - .015;
    cam.rotation.x -= Math.random()*.03;
}
