function Gun(name, size, scene) {
    this.name = name;
    this.size = size;
    this.scene = scene;

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

    // variables for the impact
    var impact = BABYLON.Mesh.CreatePlane("impact", 1, this.scene);
    impact.material = new BABYLON.StandardMaterial("impactMat", this.scene);
    impact.material.diffuseTexture = new BABYLON.Texture("img/impact.png", this.scene);
    impact.material.diffuseTexture.hasAlpha = true;
    // impact.position = new BABYLON.Vector3(0, 0, -0.1);

    var _this = this;
    var image = "img/weapons/" + _this.name + "_" + _this.index + ".png";

    var gun = $('<img id="gun", src="' + image + '"/>');
    gun.css({
        'position': 'absolute',
        'left': 0,
        'right': 0,
        'bottom': '15%',
        'margin': 'auto',
        'padding': 0,
        'width': '20%',
    });
    $('#container').append(gun);

    var cursor= $('<img id="cursor", src="img/weapons/cursor.png"/>');
    cursor.css({
        'position': 'absolute',
        'left': 0,
        'right': 0,
        'bottom': '45%',
        'padding': 0,
        'width': '5%',
    });
    $('#container').append(cursor);

    var _this = this;
    $("#canvas").click(function () {
        if (!_this.shooting) {
            _this.shooting = true;
            _this.updateFrame();
        }
    });

}


Gun.prototype.updateFrame = function(){
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
    $('#gun').attr("src", name);
    var _this = this;
    if (this.shooting){
        setTimeout(function(){_this.updateFrame()}, this.animation_speed);
    }
}

Gun.prototype.registerGunMovement = function(){
    var _this = this;
    //TODO - too lazy to convert the moveGun method to use jquery events
    document.getElementById('canvas').addEventListener('mousemove', function(evt){
        _this.moveGun(evt);
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
    var totalX = $('#canvas').width();
    var totalY = $('#canvas').height();
    var centerX = totalX / 2;
    var centerY = totalY / 2;
    var shiftX = centerX - mouseX;
    var shiftY = centerY - mouseY;

    /// TODO actually compute this
    var startX = -100;
    var startY = 100;
    var posX = startX - (shiftX/10);
    var posY = startY + (shiftY/10);

    $('#gun').css({ 'left': posX + 'px', 'bottom': posY + 'px' });
    $('#cursor').css({ 'left': centerX - 25 + 'px', 'bottom': centerY - 25 + 'px' });
}
