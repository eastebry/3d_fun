function createLevel(scene) {
    var engine = scene.getEngine();
    BABYLON.SceneLoader.Load("", "assets/level1.babylon", engine, function (newScene) {
	// Wait for textures and shaders to be ready
	newScene.executeWhenReady(function () {
	    // Attach camera to canvas inputs
	    newScene.activeCamera.attachControl(canvas);

	    // Once the scene is loaded, just register a render loop to render it
	    engine.runRenderLoop(function() {
		newScene.render();
	    });
	});
    }, function (progress) {
	// To do: give progress feedback to user
    });
}
