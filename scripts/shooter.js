/// <reference path="babylon.js" />
"use strict";

var canvas, scene, localPlayer, playerName;

var START_POSITIONS = [
    //new BABYLON.Vector3(16, 2, 9), // for debugging/dev purposes
    //new BABYLON.Vector3(-54, -8, -71),
    //new BABYLON.Vector3(-41, 12, 143),
    //new BABYLON.Vector3(-140, 12, 164),
    new BABYLON.Vector3(-148, 37, 63)
];

function createScene(engine) {
    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -1, 0);
    scene.collisionsEnabled = true;
    var MCOUNT = 33;
    scene.updateables = [];

    // createLevel(scene);
    BABYLON.SceneLoader.ImportMesh("","","assets/level1.babylon", scene)
    var pos = START_POSITIONS[Math.floor(Math.random() * START_POSITIONS.length)];
    localPlayer = new Player(scene, pos);
    // createGround(scene, 1000, 1000);
    createSkybox(scene);
    createLights(scene);

    var ryu = new Ryu(scene);
    scene.ryu = ryu;
    // Make some zombies
    // var zombies = []
    // for (var i = 0;i<3;i++) {
    //     zombies.push(new Zombie(scene));
    // }
    // scene.zombies = zombies;
    return scene;
}

function createBox(scene, x, y, z){
    var cubeWallMaterial = new BABYLON.StandardMaterial("cubeWalls", scene);
    cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/masonry-wall-texture.jpg", scene);
    cubeWallMaterial.bumpTexture = new BABYLON.Texture("textures/masonry-wall-bump-map.jpg", scene);
    cubeWallMaterial.specularTexture = new BABYLON.Texture("textures/masonry-wall-normal-map.jpg", scene);

    var box = BABYLON.Mesh.CreateBox("p1", 8, scene);
    box.material = cubeWallMaterial;
    box.position = new BABYLON.Vector3(x, y, z);
    return box;
}

function createGround(scene, w, h){
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/metalbridgebeam2.jpg", scene);
    //groundMaterial.emissiveTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_d100.jpg", scene);
    groundMaterial.diffuseTexture.uScale = MCOUNT;
    groundMaterial.diffuseTexture.vScale = MCOUNT;
    groundMaterial.bumpTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_b010.jpg", scene);
    groundMaterial.bumpTexture.uScale = MCOUNT;
    groundMaterial.bumpTexture.vScale = MCOUNT;
    groundMaterial.specularTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_s100-g100-r100.jpg", scene);
    groundMaterial.specularTexture.uScale = MCOUNT;
    groundMaterial.specularTexture.vScale = MCOUNT;

    //var ground = BABYLON.Mesh.CreateGround("ground", (MCOUNT + 2) * BLOCK_SIZE,
    //    (MCOUNT + 2) * BLOCK_SIZE,
    //    1, scene, false);
    var ground = BABYLON.Mesh.CreateGround("ground", w, h, 1, scene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    ground.setPhysicsState({ impostor: BABYLON.PhysicsEngine.PlaneImpostor, mass: 0, friction: 0.1, restitution: 0.7 });
}

function createSkybox(scene) {
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    skybox.infiniteDistance = true;
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
}

function createLights(scene){
    var hemilight = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
    hemilight.diffuse = new BABYLON.Color3(1, 1, 1);
    hemilight.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
    hemilight.groundColor = new BABYLON.Color3(0, 0, 0);
}




window.onload = function () {
    canvas = document.getElementById("canvas");

    // Lol, this is janky. The entire cookie is the username :P
    if (document.cookie === ""){
        playerName = prompt("Enter your username:");
        document.cookie = playerName;
    }
    else {
        playerName = document.cookie;
    }
    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        var engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });

        scene = createScene(engine);
	BABYLON.SceneLoader.ImportMesh(null, "assets/", "models.babylon", scene, 
				       function (newMeshes, particleSystems) {
	    _rocketmesh = newMeshes[0];
            _rocketmesh.setEnabled(false); 					   
	});

        // Enable keyboard/mouse controls on the scene (FPS like mode)
        //scene.registerBeforeRender(update);
        engine.runRenderLoop(function () {
            scene.render();
            scene.ryu.update();

            // Update zombies
            /*for (var key in scene.zombies) {
                scene.zombies[key].update();
            }*/
            scene.updateables.forEach(function (that) {
                that.update();
            });
            // if (scene.zombies) {
            //     scene.zombies.map(function(that) {
            //         that.update();
            //     });
            // }
        });
    }
};

var _rocketmesh = null;
