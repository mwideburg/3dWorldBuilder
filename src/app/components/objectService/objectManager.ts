import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import * as THREE from "three";

@Injectable({
    providedIn: "root",
})
export class ObjectManager {
    objects: THREE.Mesh[] = [];

    addToScene$: Subject<THREE.Object3D> = new Subject();

    removeFromScene$: Subject<THREE.Object3D> = new Subject();

    // constructor(scene: THREE.Scene) {
    //     this.scene = scene;
    // }

    public addMeshToObjects(mesh: THREE.Mesh): void {
        this.objects.push(mesh);
        console.log(this.objects);
    }

    public removeMeshFromObjects(mesh: THREE.Mesh): void {
        console.log("REMOVEING MESH", this.objects);
        this.objects = this.objects.filter((obj) => obj !== mesh);
        console.log(this.objects);
    }

    public addCubeObject(cube: THREE.Object3D): void {
        const mesh = cube.children.find((obj) => obj.name === "cube");

        if (mesh && mesh instanceof THREE.Mesh) {
            this.addMeshToObjects(mesh);
        }
    }

    public removeCubeObject(cube: THREE.Object3D): void {
        const mesh = cube.children.find((obj) => obj.name === "cube");

        if (mesh && mesh instanceof THREE.Mesh) {
            this.removeMeshFromObjects(mesh);
        }
    }
}
