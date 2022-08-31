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
            transparent: true,
        });
        this.mesh = new THREE.Mesh(cubeGeo, cubeMaterial);
        const edgesGeo = dimensions
            ? new THREE.BoxGeometry(
                  dimensions.width + 1,
                  dimensions.height + 1,
                  dimensions.depth + 1,
              )
            : new THREE.BoxGeometry(51, 101, 51);
        const edges = new THREE.EdgesGeometry(edgesGeo);
        this.edges = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: "white", linewidth: 50, linecap: "square" }),
        );

        this.mesh.name = "cube";
        this.group.name = "unit";
        this.group.add(this.mesh);
        this.group.add(this.edges);
    }
}
