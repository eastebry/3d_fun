function Zombie(scene) {
    this.scene = scene;
    this.createZombie(scene);
};

Zombie.prototype.createZombie = function(scene) {
    var zombie = new BABYLON.Mesh.CreatePlane("zombie", 5.0, scene);
    zombie.material = new BABYLON.StandardMaterial("zombie_mat", scene);
    zombie.material.emissiveTexture = new BABYLON.Texture("textures/zombie.png", scene);
    zombie.material.emissiveTexture.hasAlpha = true;
    zombie.material.diffuseTexture = new BABYLON.Texture("textures/zombie.png", scene);
    zombie.material.diffuseTexture.hasAlpha = true;
    zombie.material.backFaceCulling = false;
    zombie.position.z = 0;
    zombie.position.x = 5;
    zombie.position.y = 2.5;
    this.zmesh = zombie;
};

Zombie.prototype.update = function() {
    this.zmesh.lookAt(this.scene.activeCamera.position);
}
