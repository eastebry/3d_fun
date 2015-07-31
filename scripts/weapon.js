function Weapon(name, size, scene) {
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

    var _this = this;
}

function addCursor() {
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
}

Weapon.prototype.getPick = function() {
    var canvas = $('#canvas');
    var x =  canvas.width()/2;
    var y = canvas.height()/2;
    var pickResult  = this.scene.pick(x, y, null, false, scene.activeCamera);
    if (pickResult.hit) {
        return pickResult;
    }
    return null;
}

Weapon.prototype.stop_fire = function() {
    return 1;
}

Weapon.prototype.shoot = function() {
    if (!this.active) {
        return;
    }
    var pickRes = this.getPick();
    this.fire();
}

Weapon.prototype.deactivate = function() {
    this.active = false;
    $("#weapon").remove();
}

Weapon.prototype.activate = function() {
    this.active = true;
    var image = "img/weapons/" + this.name + ".png";
    var gun = $('<img id="weapon", src="' + image + '"/>');
    gun.css({
        'position': 'absolute',
        'left': 0,
        'right': 0,
        'bottom': '15%',
        'margin': 'auto',
        'padding': 0,
        'width': '20%',
        'z-index': 1,
    });
    if (this.name == "machinegun") {
        gun.css("width", "40%");
        gun.css("left", "20%");
    }
    $('#container').append(gun);
};

Weapon.prototype.registerGunMovement = function(){};

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};
