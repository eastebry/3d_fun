function Player(scene, position) {
    this.scene = scene;
    this.initCamera(scene, position);
    this.guns = [new Gun('pistol', 4, scene), new Rocket('rocket', 4, scene), new Machinegun('machinegun', 2, scene)];
    this.gun_index = 0;
    for (var i = 1; i < this.guns.length; i++){
        this.guns[i].deactivate()
    }
    this.guns[this.gun_index].activate();
    this.currentWeapon = this.guns[this.gun_index];
    this.createHud();
    this.dead = false;
    this.camera.fov = 70 * Math.PI/180;
    addCursor();

    // we will use fog for an alpha splash when a character gets hit
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.9, 0, 0);

    this.fogDensity = 0.00;
    scene.fogDensity = this.fogDensity;
};

Player.prototype.initCamera = function(scene, position) {
    var freeCamera = new BABYLON.FreeCamera("free", position, scene);
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
    canvas.addEventListener("mousedown", function(evt) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
            _this.guns[_this.gun_index].registerGunMovement();
        }
        _this.guns[_this.gun_index].shoot();
    }, false);

    canvas.addEventListener("mouseup", function(evt) {
        _this.guns[_this.gun_index].stop_fire();
    });

    // Switch weapons
    window.addEventListener("keydown", function(evt) {
        if (evt.keyCode == 82){
            _this.die();
        }
        else {
            if (_this.dead){
                return;
            }
            var index = evt.keyCode - 49;
            if (index < _this.guns.length && index >= 0) {
                if (!_this.guns[index].active) {
                    _this.guns[_this.gun_index].deactivate();
                    _this.gun_index = index;
                    _this.guns[_this.gun_index].activate();
                    _this.guns[_this.gun_index].registerGunMovement();
                }
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
    var hud = $('<img id="hud", src="img/hud-modified.png"/>')
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

Player.prototype.updateHitFog = function(){
    this.scene.fogDensity = this.scene.fogDensity/1.1;
    var _this = this;
    if (_this.scene.fogDensity >= .00005){
        setTimeout(function(){ _this.updateHitFog()}, 10);
    }
    else {
        this.scene.fogDensity = 0;
        this.animatingRedAlpha = false;
    }
}

Player.prototype.hit = function() {
    if (!this.animatingRedAlpha) {
	playSound('pain');
        this.animatingRedAlpha = true;
        this.scene.fogDensity = .06;
        var _this = this;
        setTimeout(function () {
            _this.updateHitFog()
        }, 10);
    }
}

Player.prototype.die = function() {
    if (!this.dead){
        socket.emit("message", {"playerId": mySocketId, "message": playerName + " was killed"});
        this.dead = true;
        playSound('death');
        var _this = this;
        this.guns[this.gun_index].deactivate();
        this.camera.applyGravity = false;
        this.animateDieCamera();
        this.camera.speed = 0;
        setTimeout(function () {_this.updateDieFog()}, 10);
        setTimeout(function(){location.reload()}, 5000);
    }

}

Player.prototype.updateDieFog = function(){
    this.scene.fogDensity += .001;
    var _this = this;
    if (_this.scene.fogDensity < 1){
        setTimeout(function(){ _this.updateDieFog()}, 30);
    }
    else {
        this.scene.fogDensity = 1;
    }
}

Player.prototype.animateDieCamera = function() {
    var animCamPosition = new BABYLON.Animation("animCam", "position", 30,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysPosition = [];
    keysPosition.push({
        frame: 0,
        value: this.camera.position
    });
    keysPosition.push({
        frame: 25,
        value: new BABYLON.Vector3(this.camera.position.x, this.camera.position.y - 4, this.camera.position.z),
    });

    animCamPosition.setKeys(keysPosition);

    var animCamRotation = new BABYLON.Animation("animCam", "rotation", 30,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keysRotation = [];
    keysRotation.push({
        frame: 0,
        value: this.camera.rotation
    });
    keysRotation.push({
        frame: 30,
        value: new BABYLON.Vector3(-1, this.camera.rotation.y, 0)
    });

    animCamRotation.setKeys(keysRotation);
    this.camera.animations.push(animCamPosition);
    this.camera.animations.push(animCamRotation);

    scene.beginAnimation(this.camera, 0, 100, false);
}
