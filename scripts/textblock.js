function TextBlock(scene, text, pos) {
    this.scene = scene;
    this.mesh = BABYLON.Mesh.CreatePlane('box', 5, scene);
    this.mesh.position.copyFrom(pos);
    this.mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    this.setText(text);
}

TextBlock.prototype.setText = function(str) {
    var mat = new BABYLON.StandardMaterial("outputplane", this.scene);
    var tex = new BABYLON.DynamicTexture("dynamic texture", 512, this.scene, true);
    var context2D = tex.getContext();
    tex.hasAlpha = true;
    tex.drawText(str, null, 140, '72px Calibri', 'white');
    mat.emissiveTexture = tex;
    mat.diffuseTexture = tex;
    this.mesh.material = mat;
}
