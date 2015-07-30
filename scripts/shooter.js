/// <reference path="babylon.js" />

"use strict";

var freeCamera, canvas, scene;
var gunMovementX = 0, gunMovementY = 0;
var MCOUNT = 33;

function createScene(engine) {
    var scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -10, 0);
    scene.collisionsEnabled = true;
    var MCOUNT = 33;

    var player = new Player(scene);
    createGround(scene, 100, 100);
    createSkybox(scene);
    createLights(scene);
    createBox(scene, 10,10,10);

    var zombie = new Zombie(scene);
    scene.zombie = zombie;
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
}

function createGround(scene, w, h){
    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.emissiveTexture = new BABYLON.Texture("textures/arroway.de_tiles-35_d100.jpg", scene);
    groundMaterial.emissiveTexture.uScale = MCOUNT;
    groundMaterial.emissiveTexture.vScale = MCOUNT;
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
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
}

function createLights(scene){
    //At Last, add some lights to our scene
    var light0 = new BABYLON.PointLight("pointlight0", new BABYLON.Vector3(28, 78, 385), scene);
    light0.diffuse = new BABYLON.Color3(0.5137254901960784, 0.2117647058823529, 0.0941176470588235);
    light0.intensity = 0.2;

    var light1 = new BABYLON.PointLight("pointlight1", new BABYLON.Vector3(382, 96, 4), scene);
    light1.diffuse = new BABYLON.Color3(1, 0.7333333333333333, 0.3568627450980392);
    light1.intensity = 0.2;
}



window.onload = function () {
    canvas = document.getElementById("canvas");

    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {
        var engine = new BABYLON.Engine(canvas, true);

        window.addEventListener("resize", function () {
            engine.resize();
        });

        canvas.addEventListener("mousedown", function (evt) {
            var pickResult = scene.pick(evt.clientX, evt.clientY);
            if (pickResult.hit) {
                var dir = pickResult.pickedPoint.subtract(scene.activeCamera.position);
                dir.normalize();
                pickResult.pickedMesh.applyImpulse(dir.scale(50), pickResult.pickedPoint);
            }
        });

        scene = createScene(engine);
        // Enable keyboard/mouse controls on the scene (FPS like mode)

        //scene.registerBeforeRender(update);
        engine.runRenderLoop(function () {
            scene.render();
            scene.zombie.update();
        });
    }
};
