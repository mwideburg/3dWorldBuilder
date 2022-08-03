import * as THREE from "three";
export class Cube {
    mesh: THREE.Mesh;

    constructor() {
        const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: "gray",
        });
        this.mesh = new THREE.Mesh(cubeGeo, cubeMaterial);
    }
}
