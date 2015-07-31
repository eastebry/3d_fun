function BloodSpatter(scene, emitter) {
    // Create a particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    particleSystem.particleTexture = new BABYLON.Texture("img/particle2.png", scene);

    // Where the particles come from
    particleSystem.emitter = emitter; // the starting object, the emitter
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

    // Colors of all particles
    particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(1, 0, 0, 0.0);

    // Size of each particle (random between...
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    // Emission rate
    particleSystem.emitRate = 30000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(10, 10, 10);

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction2 = new BABYLON.Vector3(2*Math.PI,2*Math.PI, 2*Math.PI);

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;

    // Speed
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 10;
    particleSystem.updateSpeed = 0.005;

    // Start the particle system
    particleSystem.start();
    particleSystem.manualEmitCount = 30000;
    var _this = this;
    setTimeout(function(){_this.particleSystem.stop()}, 2000);
}