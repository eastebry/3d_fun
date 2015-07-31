function Marine(scene, pos) { 
    if (!Marine.spritemanager) Marine.init(scene);
    this.state = 'walk';
    this.scene = scene;
    this.text = new TextBlock(scene, "player", pos);
    this.text.mesh.setEnabled(false);
    this.sprite = new BABYLON.Sprite('marine', Marine.spritemanager);
    this.sprite.size = 5;
    this.sprite.position.copyFrom(pos);
    this.sheetWidth = 12;
    this.rotation = Math.random() * 2 * Math.PI;
    this.stateStack = [];
    this.timeouts = {};
    this.sprite.animIndex = 0;
    var that = this;

    // hackety hack hack
    this.sprite._animate = function(deltaTime) { 
        if (!this._animationStarted)
            return;

	that.text.mesh.position.copyFrom(that.sprite.position);
	
        this._time += deltaTime;
	if (this._time <= this._delay) return;
	else this._time %= this._delay;

	var dir = localPlayer.camera.rotation.y;
	var r = that.rotation - dir;
	var dr = (r + 31.416) % (2 * Math.PI);
	var row = dr * 8 / (2 * Math.PI) | 0;

	this.anim = this.anim + 1 || 0;
	if (this.anim >= this.frames.length && this._loopAnimation)
	    this.anim = 0;
	else if (this.anim >= this.frames.length && !this._loopAnimation) {
	    this.anim = 0;
	    this._animationStarted = false;
	    if (this.disposeWhenFinishedAnimating)
		this.dispose();
	    return;
	}

	var curframe = this.frames[this.anim] + row * that.sheetWidth;
	this.cellIndex = curframe;
	return;
    };

    this.walk();
}
Marine.prototype.animate = function(states, duration) { 
    var that = this;
    if (!duration) { 
	// blow away state stack
	for(var x in this.timeouts) clearTimeout(x); 
	this.stateStack = []; 
	this.timeouts = [];
    }
    else {
	setTimeout(function() { 
	    that.stateStack.pop();
	    setAnimation(that.stateStack[that.stateStack.length-1]);
	}, duration * 1000);
    }
    this.stateStack.push(states);
    function setAnimation(states) { 
	var dir = localPlayer.camera.rotation.y;
	var r = dir - that.rotation;
	var dr = (r + 31.416) % (2 * Math.PI);
	var row = dr * 8 / (2 * Math.PI) | 0;
	that.sprite.frames = states;
	that.sprite.playAnimation(
	    states[0], 
	    states[states.length-1] + 1,
	    true,
	    300
	);
	that.sprite.animIndex = 0;
    }
    setAnimation(that.stateStack[that.stateStack.length-1]);
}
Marine.prototype.die = function(duration) { 
    this.animate([6, 7, 8, 9, 10, 11], duration);
};

Marine.prototype.hurt = function(duration) { 
    this.animate([0, 6, 7], duration);
};

Marine.prototype.walk = function(i) { 
    this.animate([0,1,2,3], i);
};
Marine.prototype.shoot = function(i) { 
    this.animate([4,5], i);
};

Marine.init = function(scene) { 
    Marine.spritemanager = new BABYLON.SpriteManager('marinesManager', '../assets/marine.png', 2000, 64, scene);
};
