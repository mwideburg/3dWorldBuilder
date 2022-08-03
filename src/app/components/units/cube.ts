import * as THREE from "three";
export class Cube {
    mesh: THREE.Mesh;

    constructor() {
        const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        const cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xfeb74c,
            map: new THREE.TextureLoader().load("textures/square-outline-textured.png"),
        });
        this.mesh = new THREE.Mesh(cubeGeo, cubeMaterial);
    }
}
