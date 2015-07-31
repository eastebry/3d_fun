function BloodSpatter(scene, emitter) {
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
    this.particleSystem.minSize = 0.1;
    this.particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    this.particleSystem.minLifeTime = 0.3;
    this.particleSystem.maxLifeTime = 1.0;

    // Emission rate
    this.particleSystem.emitRate = 30000;

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
    this.particleSystem.manualEmitCount = 30000;
    this.particleSystem.disposeOnStop = true;
    var _this = this;
    setTimeout(function(){_this.particleSystem.stop();}, 2000);
}

function groundParticles(scene, x, y, z) {
    var emitter = BABYLON.Mesh.CreateBox("p1", 1, scene);
    emitter.position = new BABYLON.Vector3(x, y, z);
    emitter.isVisible = false;
    this.particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    this.particleSystem.particleTexture = new BABYLON.Texture("img/particle2.png", scene);

    // Where the particles come from
    this.particleSystem.emitter = emitter; // the starting object, the emitter
    this.particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    this.particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    this.particleSystem.color1 = new BABYLON.Color4(0.6, 0.6, 0.6,0.8);
    this.particleSystem.color2 = new BABYLON.Color4(0.6, 0.6, 0.6, 0.8);
    this.particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);

    // Size of each particle (random between...
    this.particleSystem.minSize = 0.1;
    this.particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    this.particleSystem.minLifeTime = 0.3;
    this.particleSystem.maxLifeTime = 1;

    this.particleSystem.gravity = new BABYLON.Vector3(0, -90, 0);
    // Emission rate
    this.particleSystem.emitRate = 150;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    this.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Direction of each particle after it has been emitted
    this.particleSystem.direction1 = new BABYLON.Vector3(1, 1, 1);
    this.particleSystem.direction2 = new BABYLON.Vector3(-1, -1, -1);

    // Angular speed, in radians
    this.particleSystem.minAngularSpeed = 0;
    this.particleSystem.maxAngularSpeed = 2 * Math.PI;

    // Speed
    this.particleSystem.minEmitPower = 10;
    this.particleSystem.maxEmitPower = 20;
    this.particleSystem.updateSpeed = 0.005;

    // Start the particle system
    this.particleSystem.start();
    this.particleSystem.manualEmitCount = 2000;
    var _this = this;
    this.particleSystem.disposeOnStop = true;
    setTimeout(function(){_this.particleSystem.stop();}, 2000);
}

