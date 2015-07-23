function Player(scene) {
    this.scene = scene;
    this.gunMovementX = 0;
    this.maxGunMovementX = 1000;
    this.gunMovementY = 0;
    this.maxGunMovementY = 200;
    this.initCamera(scene);
};

Player.prototype.initCamera = function(scene) {
    var freeCamera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(0, 1, 0), scene);
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    scene.activeCamera.attachControl(canvas);
    this.createHud();
    this.initfpsControls(scene);
};

Player.prototype.initfpsControls = function(scene) {
    var cam,c;

    // switch the hot keys.
    for (cam in scene.cameras) {
        c = scene.cameras[cam];
        c.keysUp = [87]; // w
        c.keysLeft = [65]; // a
        c.keysDown = [83]; // s
        c.keysRight = [68]; // d
    }
    var canvas = scene.getEngine().getRenderingCanvas();
    // On click event, request pointer lock
    var _this = this;
    canvas.addEventListener("click", function(evt) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
        canvas.addEventListener('mousemove', function(evt) {_this.moveGun(evt)});
    }, false);
};

Player.prototype.createHud = function() {
    var gun = $('<img id="gun", src="img/weapons/pistol.png"/>');
    gun.css({
        'position': 'absolute',
        'left': 0,
        'right': 0,
        'bottom': '15%',
        'margin': 'auto',
        'padding': 0,
        'width': '15%',
    });
    $('#container').append(gun);
    var hud = $('<img id="hud", src="img/hud.png"/>')
    hud.css({
        'width': '100%',
        'position': 'absolute',
        'bottom': 0,
        'left': 0,
        'right': 1,
        'margin': 'auto',
        'padding': 0,
        'background-color': 'black',
    });
    $('#container').append(hud);
};

Player.prototype.moveGun = function(e) {
    console.log(this.gunMovementX);
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
    /// TODO actually compute this
    var startY = 100;
    var posX = startX - (shiftX/10);
    var posY = startY + (shiftY/10);

    $('#gun').css({ 'left': posX + 'px', 'bottom': posY + 'px' });
};
