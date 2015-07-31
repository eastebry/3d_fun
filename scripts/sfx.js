function BloodSpatter(scene, emitter, target) {

    if (!emitter) {
	emitter = BABYLON.Mesh.CreateBox("emitter", 0.01, scene);
	console.log('target', target);
	emitter.position.copyFrom(target);
	emitter.setEnabled(true);
	setTimeout(function(){ emitter.dispose();}, 5010);
    }

    // Create a particle system
    this.particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    this.particleSystem.particleTexture = new BABYLON.Texture("img/particle2.png", scene);

    // Where the particles come from
    this.particleSystem.emitter = emitter; // the starting object, the emitter
    this.particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    this.particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    this.particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
    this.particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
    this.particleSystem.colorDead = new BABYLON.Color4(1, 0, 0, 0.0);

    // Size of each particle (random between...
    this.particleSystem.minSize = 0.9;
    this.particleSystem.maxSize = 1.6;

    // Life time of each particle (random between...
    this.particleSystem.minLifeTime = 0.3;
    this.particleSystem.maxLifeTime = 1.0;

    // Emission rate
    this.particleSystem.emitRate = 150;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    this.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    this.particleSystem.gravity = new BABYLON.Vector3(0, -100, 0);

    // Direction of each particle after it has been emitted
    this.particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    this.particleSystem.direction2 = new BABYLON.Vector3(2*Math.PI,2*Math.PI, 2*Math.PI);

    // Angular speed, in radians
    this.particleSystem.minAngularSpeed = 0;
    this.particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    this.particleSystem.minEmitPower = 1;
    this.particleSystem.maxEmitPower = 4;
    this.particleSystem.updateSpeed = 0.005;

    // Start the particle system
    this.particleSystem.start();
    this.particleSystem.manualEmitCount = 600;
    this.particleSystem.disposeOnStop = true;
    var _this = this;
    setTimeout(function(){_this.particleSystem.stop();}, 2000);
}

function Sparks(scene, point) {
    var emitter = BABYLON.Mesh.CreateBox("emitter", 0.01, scene);
    emitter.position.copyFrom(point);
    emitter.setEnabled(true);
    BloodSpatter.call(this, scene, emitter);
    this.particleSystem.minSize = 1.0;
    this.particleSystem.maxSize = 1.6;
    this.particleSystem.manualEmitCount = 300;
    this.particleSystem.direction1 = new BABYLON.Vector3(1, 1, 1);
    this.particleSystem.direction2 = new BABYLON.Vector3(-1, -1, -1);
    this.particleSystem.color1 = new BABYLON.Color4(1, 1, 0, 1.0);
    this.particleSystem.color2 = new BABYLON.Color4(1, 1, 0, 1.0);
    this.particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 1.0);
    this.particleSystem.minEmitPower = 10;
    this.particleSystem.maxEmitPower = 20;
    setTimeout(function() { emitter.dispose() }, 3000);
}
Sparks.prototype = BloodSpatter.prototype;
