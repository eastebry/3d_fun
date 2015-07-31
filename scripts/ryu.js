function Ryu(scene) {
    this.scene = scene;
    this.numCells = 7;
    this.pos = 0;

    var image = "img/characters/ryu1.png";

    var spriteManager = new BABYLON.SpriteManager("characterManager", image, 1, 114, scene, 0.0);

    this.spriteManager = spriteManager;

    var ryu = new BABYLON.Sprite("ryu", spriteManager);
    ryu.position.y = 11;
    ryu.position.x = 9;
    ryu.position.z = 177;
    ryu.size = 5;

    this.ryu = ryu;
    this.speed = 2;
    this.isMoving = false;
    this.basePos = new BABYLON.Vector3(0, 11, 180);
    this.sleepUntil = 0;

}

Ryu.prototype.update = function(){

  var drange = 360 * (1/this.numCells);

  var source = this.scene.activeCamera.position;
  var target = this.ryu.position;
  var control = {x:0,z:0};

  var angle = calculateAngle(source,target,control);

  var cell = Math.floor((angle/drange)%this.numCells);

  if (cell != this.pos){
    this.ryu.playAnimation(this.pos,cell,false,100);
    this.pos = cell;
  }
     if (!this.isMoving) {
         if (new Date().getTime() > this.sleepUntil) {
             var nextPos = new BABYLON.Vector3(Math.random()*40-20, 0, Math.random()*40-20);
             nextPos = this.basePos.add(nextPos);
             this.setDestination(nextPos);
             this.sleepUntil = new Date().getTime() + Math.random()*2500;
         }
     }
    this.doMovement();

}

function calculateAngle(source,target,control) {

  var a = distance(source,control);
  var b = distance(target,control);
  var c = distance(source,target);

  var A = Math.acos(((b*b)+(c*c)-(a*a))/(2*b*c));

  return toDegrees(A);

}

function distance(p1,p2){
  var dx = p2.x-p1.x;
  var dz = p2.z-p1.z;
  return Math.sqrt(dx*dx + dz*dz);
}

function toDegrees(angle){
  return angle * (180/Math.PI);
}

Ryu.prototype.doMovement = function() {
    var movedRatio = (new Date().getTime() - this.startTime) / (this.endTime - this.startTime);
    if (movedRatio < 1) {
        this.isMoving = true;
        var newPos = new BABYLON.Vector3.Lerp(this.originalPos, this.nextPos, movedRatio);
        this.ryu.position = newPos;
    }
    else {
        this.isMoving = false;
    }
}

Ryu.prototype.setDestination = function(nextPos) {
    this.nextPos = nextPos;
    this.originalPos = new BABYLON.Vector3;
    this.originalPos = this.ryu.position;
    var dist = BABYLON.Vector3.Distance(this.ryu.position, this.nextPos);
    this.timeToNextPos = dist / this.speed * 100;
    this.startTime = new Date().getTime();
    this.endTime = this.startTime + this.timeToNextPos;
}

