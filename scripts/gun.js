function Gun(name, size, scene) {
    this.name = name;
    this.size = size;
    this.scene = scene;
    this.active = false;
    // Variables for moving the gun
    this.gunMovementX = 0;
    this.maxGunMovementX = 1000;
    this.gunMovementY = 0;
    this.maxGunMovementY = 200;

    // variables for animating
    this.index = 0;
    this.animation_direction = 1; //1 = up, -1 = down
    this.animation_speed = 100;
    this.shooting = false;

    this.impactSpriteManager = new BABYLON.SpriteManager("impactManager", "img/impact.png", 2000, 800, this.scene);

    var _this = this;
}

inheritsFrom(Gun, Weapon);

Gun.prototype.updateFrame = function(){
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
    var _this = this;
    if (this.shooting){
        setTimeout(function(){_this.updateFrame()}, this.animation_speed);
    }
}

Gun.prototype.registerGunMovement = function(){
    var _this = this;
    //TODO - too lazy to convert the moveGun method to use jquery events
    document.getElementById('canvas').addEventListener('mousemove', function(evt){
        if (_this.active) { 
            _this.moveGun(evt);
        }
    });
}

Gun.prototype.moveGun = function(e) {
    this.gunMovementX += e.movementX;
    this.gunMovementY += e.movementY;
    if (this.gunMovementX <  -1 * this.maxGunMovementX) this.gunMovementX = -1 * this.maxGunMovementX;
    if (this.gunMovementX > this.maxGunMovementX) this.gunMovementX = this.maxGunMovementX;
    if (this.gunMovementY <  -1 * this.maxGunMovementY) this.gunMovementY = -1 * this.maxGunMovementY;
    if (this.gunMovementY > this.maxGunMovementY) this.gunMovementY = this.maxGunMovementY;

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
}

Gun.prototype.fire = function() {
    if (!this.shooting) {
        this.shooting = true;
        playSound('pistol');
        this.updateFrame();
        // send the hit event to server to reduce player's health
        var pickResult = this.getPick();
        if (pickResult.pickedMesh && pickResult.pickedMesh.playerId) {
            new BloodSpatter(this.scene, pickResult.pickedMesh);
            socket.emit('hit', {
                id: pickResult.pickedMesh.playerId,
                weapon: 'pistol'
            });
        } else if (pickResult.pickedMesh.playerId === undefined){
            groundParticles(this.scene, pickResult.pickedPoint.x, pickResult.pickedPoint.y, pickResult.pickedPoint.z);
        }
    }
}



