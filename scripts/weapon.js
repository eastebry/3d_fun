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
        console.log(pickResult);
        return pickResult;
        // TODO - create an impact sprite, this method looks pretty bad
        //var newsprite = new BABYLON.Sprite("impact", this.impactSpriteManager);
        //newsprite.position = pickResult.pickedPoint;
    }
    return null;
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
    $('#container').append(gun);
}

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};