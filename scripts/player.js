function Player(scene) {
    this.scene = scene;
    this.initCamera(scene);
    this.gun = new Gun('pistol', 4, scene);
    this.gun.activate();
    this.rocket = new Rocket('rocket', 4, scene);
    this.rocket.deactivate();
    this.currentWeapon = this.gun;
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
    this.camera = freeCamera
};

Player.prototype.initfpsControls = function(scene) {
    var _this = this;
    var cam,c;

    // switch the hot keys.
    for (cam in scene.cameras) {
        c = scene.cameras[cam];
        c.keysUp = [87]; // w
        c.keysLeft = [65]; // a
        c.keysDown = [83]; // s
        c.keysRight = [68]; // d
        c.inertia = 0;
        c.angularSensibility = 1200;
        c.speed = 20;
    }
    var canvas = scene.getEngine().getRenderingCanvas();
    // On click event, request pointer lock
    var _this = this;
    canvas.addEventListener("click", function(evt) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
            _this.gun.registerGunMovement();
        }
    }, false);

    // Switch weapons
    window.addEventListener("keydown", function(evt) {
        if (evt.keyCode == 49) { // "1", switch to gun
            if (!_this.gun.active) {
                _this.currentWeapon.deactivate();
                _this.gun.activate();
                _this.currentWeapon = _this.gun;
            }
        }
        if (evt.keyCode == 50) { // "2", switch to rocket
            if (!_this.rocket.active) {
                _this.currentWeapon.deactivate();
                _this.rocket.activate();
                _this.currentWeapon = _this.rocket;
            }
        }
    });

    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function (event) {
        _this.controlEnabled = (
                           document.mozPointerLockElement === canvas
                        || document.webkitPointerLockElement === canvas
                        || document.msPointerLockElement === canvas
                        || document.pointerLockElement === canvas);
        // If the user is alreday locked
        if (!_this.controlEnabled) {
            _this.camera.detachControl(canvas);
        } else {
            _this.camera.attachControl(canvas);
        }
    };

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
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
