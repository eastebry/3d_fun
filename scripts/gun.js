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
        'top': '50%',
        'left': '50%',
        'margin-top': '-37px',
        'margin-left': '-37px',
        'right': 0,
        'padding': 0,
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
