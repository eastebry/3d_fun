function Rocket(name, size, scene) {
    this.name = name;
    this.size = size;
    this.scene = scene;
    this.active = false;
    // Variables for moving the gun

    var _this = this;

}

inheritsFrom(Rocket, Weapon);

Rocket.prototype.fire = function() {
    return 1;
}
