var _allsounds = {
    pistol: ('sound/dspistol.wav'),
    pain: ('sound/dsplpain.wav'),
    death: ('sound/dspldeth.wav'),
    rocket: ('sound/rocket.wav'),
    bomb: ('sound/bomb.wav')
}

var context = new AudioContext();

function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
}
function playSound(sound, location) {
    var volume = 1.0;
    if (localPlayer.camera.position && location) { 
	var a = localPlayer.camera.position;
	var b = location;
	var d = a.subtract(b).length() / 10
	volume = 3 / (d + 3);
	volume = Math.pow(volume, 0.8);
	if (soiund == 'rocket')
	    volumne *= 0.5;
    }
    if (sound in _allsounds) {
	if (!context.createGain)
	    context.createGain = context.createGainNode;
	var audio = new Audio(_allsounds[sound]);
	var source = context.createMediaElementSource(audio);
	
	var gainNode = context.createGain();
	source.connect(gainNode);
	gainNode.connect(context.destination);
	gainNode.gain.value = volume;
	
	if (localPlayer.camera.position && location) {
	    var p = localPlayer.camera.position;
	    var r = localPlayer.camera.rotation;
	    var b = location.subtract(localPlayer.camera.position);
	    var panner = context.createPanner();
	    source.connect(panner)
	    panner.connect(gainNode);
	    panner.setPosition(location.x, location.y, location.z);
	    context.listener.setOrientation(r.x, r.y, r.z, 0, 1, 0);
	    context.listener.setPosition(p.x, p.y, p.z);
	    console.log('3D sound');
	    console.log(location);
	    console.log(p, r);
	}
	else
	    return;

	source.loop = true;
	if (!source.start) source.start = source.noteOn;
	audio.play();
    }
    else
	console.error("Sound Not Found", sound);
}
