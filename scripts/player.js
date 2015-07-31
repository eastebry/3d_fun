function Player(scene) {
    this.scene = scene;
    this.initCamera(scene);
    this.gun = new Gun('pistol', 4, scene);
    this.rocket = new Rocket('rocket', 4, scene);
    this.rocket.deactivate();
    this.gun.activate();
    this.currentWeapon = this.gun;
    this.createHud();
    addCursor();

    // we will use fog for an alpha splash when a character gets hit
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.9, 0, 0);

    this.fogDensity = 0.00;
    scene.fogDensity = this.fogDensity;
};

Player.prototype.initCamera = function(scene) {
    var freeCamera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(15, 3, 0), scene);
    freeCamera.minZ = 1;
    freeCamera.checkCollisions = true;
    freeCamera.applyGravity = true;
    freeCamera.ellipsoid = new BABYLON.Vector3(1, 2, 1);
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
        _this.currentWeapon.shoot();
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
        'z-index': 2,
        'background-color': 'black',
    });
    $('#container').append(hud);
};

Player.prototype.updateFog = function(){
    this.scene.fogDensity = this.scene.fogDensity/1.1;
    var _this = this;
    if (_this.scene.fogDensity >= .00005){
        setTimeout(function(){ _this.updateFog()}, 10);
    }
    else {
        this.scene.fogDensity = 0;
        this.animatingRedAlpha = false;
    }
}

Player.prototype.hit = function() {
    if (!this.animatingRedAlpha) {
        var audio = new Audio('sound/dsplpain.wav');
        audio.play();
        this.animatingRedAlpha = true;
        this.scene.fogDensity = .06;
        var _this = this;
        setTimeout(function () {
            _this.updateFog()
        }, 10);
    }
}


