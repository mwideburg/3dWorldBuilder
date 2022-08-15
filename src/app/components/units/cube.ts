import * as THREE from "three";
import { Dimension } from "../types/dimensionType";
export class Cube {
    mesh: THREE.Mesh;

    group: THREE.Group = new THREE.Group();

    edges: THREE.LineSegments;

    constructor(dimensions?: Dimension) {
        const cubeGeo = dimensions
            ? new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth)
            : new THREE.BoxGeometry(50, 100, 50);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
        });
        this.mesh = new THREE.Mesh(cubeGeo, cubeMaterial);
        const edges = new THREE.EdgesGeometry(cubeGeo);
        this.edges = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff }),
        );
        this.mesh.name = "cubeMesh";
        this.group.name = "cube";
        this.group.add(this.mesh);
        this.group.add(this.edges);
    }
}
