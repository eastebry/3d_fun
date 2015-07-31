var all_context = [
    new AudioContext(),
    new AudioContext(),
    new AudioContext(),
    new AudioContext(),
];
var current_context = 0;
function Sound(src) { 
    this.src = src;
    this.volume = 1;
}
Sound.prototype.play = function(data) { 
    data = data || {};
    var a = new Audio(this.src);
    var context = this.context = all_context[current_context++ % all_context.length];
    var gain = this.gain = context.createGain();
    var panner = this.panner = context.createPanner();
    this.gain.connect(context.destination);
    this.panner.connect(gain);
    this.source = context.createMediaElementSource(a);
    this.source.connect(panner || gain);

    this.gain.gain.value = Math.pow(this.volume * (data.volume || 1), 2);

    this.panner.setPosition(0, 0, 1);
    this.context.listener.setOrientation(0, 0, 1, 0, 1, 0);
    this.context.listener.setPosition(0, 0, 0);
    
    while (data.position) {
	var p = localPlayer.camera.position;
	var d = data.position;
	var o = localPlayer.camera.rotation;
	if (p.subtract(d).length() < 1) break;
	this.panner.setPosition(d.x, d.y, d.z);
	this.context.listener.setOrientation(o.x, o.y, o.z, 0, -1, 0);
	this.context.listener.setPosition(p.x, p.y, p.z);
	break;
    }
    a.play();
};

function load(src, volume) { 
    var s = new Sound(src);
    s.volume = volume || 1;
    return s;
}
var _allsounds = {
    pistol: load('sound/dspistol.wav'),
    pain: load('sound/dsplpain.wav'),
    death: load('sound/dspldeth.wav'),
    rocket: load('sound/rocket.wav', 0.4), // dampen rocket firing vol
    bomb: load('sound/bomb.wav', 2), // boost rocket explode vol
    ricochet: load('sound/ricochet.wav')
}

function playSound(sound, location) { 
    if (sound in _allsounds)
	_allsounds[sound].play({position: location});
    else 
	console.error("Missing Audio File", sound);
}
