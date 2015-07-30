function Rocket(name, size, scene) {
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

    // variables for the impact
    var impact = BABYLON.Mesh.CreatePlane("impact", 1, this.scene);
    impact.material = new BABYLON.StandardMaterial("impactMat", this.scene);
    impact.material.diffuseTexture = new BABYLON.Texture("img/impact.png", this.scene);
    impact.material.diffuseTexture.hasAlpha = true;
    // impact.position = new BABYLON.Vector3(0, 0, -0.1);

    var _this = this;
    var image = "img/weapons/rocket.png";

    var gun = $('<img id="rocket", src="' + image + '"/>');
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
        if (_this.active) {
            var audio = new Audio('sound/dspistol.wav');
            audio.play();
            _this.fireWeapon();
        }
    });
}

Rocket.prototype.deactivate = function() {
    this.active = false;
    $("#rocket").remove();
}

Rocket.prototype.activate = function() {
    this.active = true;
    var image = "img/weapons/rocket.png";
    var gun = $('<img id="rocket", src="' + image + '"/>');
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
}

Rocket.prototype.fireWeapon = function() {
    return 1;
}
