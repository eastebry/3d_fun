function Player(scene) {
    this.scene = scene;
    this.initCamera(scene);
    this.gun = new Gun('pistol', 4, scene);
    this.createHud();
};

Player.prototype.initCamera = function(scene) {
    var freeCamera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(0, 1, 0), scene);
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    scene.activeCamera.attachControl(canvas);
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
        _this.gun.registerGunMovement();;
    }, false);
};

Player.prototype.createHud = function() {
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

