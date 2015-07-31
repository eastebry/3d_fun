function Enemy(scene, x, y, z) {
    this.postition = BABYLON.Vector3(10,10,10);
    this.scene = scene;
    var enemySpriteManager  = BABYLON.SpriteManager("enemySpriteManager", "img/characters/Cacodemon.png", 1000, 500, scene);
    var sprite = new BABYLON.Sprite("enemy", enemySpriteManager);
    sprite.position = position;
}
