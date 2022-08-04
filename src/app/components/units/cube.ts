import * as THREE from "three";
export class Cube {
    mesh: THREE.Mesh;

    group: THREE.Group = new THREE.Group();

    edges: THREE.LineSegments;

    constructor() {
        const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
        });
        this.mesh = new THREE.Mesh(cubeGeo, cubeMaterial);
        const edges = new THREE.EdgesGeometry(cubeGeo);
        this.edges = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff }),
        );
        this.group.name = "cube";
        this.group.add(this.mesh);
        this.group.add(this.edges);
    }
}
