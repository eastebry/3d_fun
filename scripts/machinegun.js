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
    this.animation_speed = 100;
    this.shooting = false;

    this.impactSpriteManager = new BABYLON.SpriteManager("impactManager", "img/impact.png", 2000, 800, this.scene);

    var _this = this;
}

inheritsFrom(Machinegun, Weapon);

Machinegun.prototype.updateFrame = function(){
    if (!this.active) {
        this.shooting = false;
        return;
    }
    this.index += this.animation_direction;
    if (this.index == this.size - 1){
        this.animation_direction = -1;
        this.index -= 1;
    }
    if (this.index == 0 && this.animation_direction == -1){
        // stop this animation
        this.shooting = false;
        this.animation_direction = 1;
    }
    var name  = "img/weapons/" + this.name + "_" + this.index+ ".png";
    $('#weapon').attr("src", name);
    $("#weapon").css("width", "40%");
    var _this = this;
    if (this.shooting){
        setTimeout(function(){_this.updateFrame()}, this.animation_speed);
    }
}

Machinegun.prototype.registerMachinegunMovement = function(){
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

    $('#weapon').css({ 'left': posX + 'px', 'bottom': posY + 'px' });
};

function showSparks(scene, source, dest, playerid) {
    new Sparks(scene, dest);
    playSound('pistol', source);
};

Machinegun.prototype.fire = function() {
    if (!this.shooting) { 
        this.shooting = true;
        var _this = this;
        this.shoot_int = setInterval(function() {
            _this.firebullet();
        }, 100);
    }
}

Machinegun.prototype.stop_fire = function() {
    clearInterval(this.shoot_int);
    this.shooting = false;
}

Machinegun.prototype.firebullet = function() {
	// send the hit event to server to reduce player's health
	var pickResult = this.getPick();
	if (pickResult.pickedMesh && pickResult.pickedMesh.playerId) {
	    new BloodSpatter(this.scene, pickResult.pickedMesh);
	    socket.emit('hit', {
		id: pickResult.pickedMesh.playerId,
		weapon: 'pistol'
	    });
	}
	else if (pickResult.pickedPoint) {
	    var event = {
		id: pickResult.pickedMesh.playerId,
		weapon: 'pistol',
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
