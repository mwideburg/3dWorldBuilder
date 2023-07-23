import { Subject } from "rxjs";

import * as THREE from "three";

import { Cube } from "../units/cube";

export class Selector {
    camera: THREE.PerspectiveCamera;

    group: THREE.Group = new THREE.Group();

    objectSelected: THREE.Object3D | null = null;

    unitSelected: any | null = null;

    isShiftDown: boolean = false;

    rollOverCopyMeshGroup: THREE.Group = new THREE.Group();

    isCopying: boolean = false;

    addObject$: Subject<THREE.Object3D> = new Subject();

    createCopyGroup$: Subject<boolean> = new Subject();

    attachObjectToSelectedGroup$: Subject<THREE.Object3D> = new Subject();

    attachObjectToScene$: Subject<THREE.Object3D> = new Subject();

    combinedUnits$: Subject<{ add: Cube; remove: THREE.Object3D[] }> = new Subject();

    constructor(camera: THREE.PerspectiveCamera) {
        this.camera = camera;

        this.addObject$.next(this.rollOverCopyMeshGroup);
    }

    public disable(): void {
        console.log("Selector");
    }

    public dispose(): void {
        console.log("DISPOSING DRAG AND DROP");

        this.group.children.forEach((child) => {
            child.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "cube") {
                    mesh.material.color.set(0xaaaaaa);
                }
            });
        });
        // this.group = new THREE.Group();
    }

    public disposeTemp(): void {
        this.group.children.forEach((child) => {
            child.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "cube") {
                    mesh.material.color.set(0xaaaaaa);
                }
            });
        });
    }

    public activate(): void {
        // this.group.children.forEach((child) => {
        //     child.children.forEach((mesh) => {
        //         if (mesh instanceof THREE.Mesh && mesh.name === "cube") {
        //             mesh.material.color.set("red");
        //         }
        //     });
        // });
    }

    public onPointerMove(
        raycaster: THREE.Raycaster,
        plane: THREE.Object3D[],
        isCopying: boolean,
        rollOverMeshGroup: THREE.Group,
    ): void {
        const intersects = raycaster.intersectObjects(plane, false);

        if (
            intersects.length > 0 &&
            isCopying &&
            rollOverMeshGroup.children[0] instanceof THREE.Mesh
        ) {
            const intersect = intersects[0];

            if (intersect.face) {
                const original = new THREE.Vector3().copy(rollOverMeshGroup.children[0].position);
                const vect3 = new THREE.Vector3().copy(intersect.point).add(intersect.face.normal);
                vect3.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                // const faceHeight = intersect.object

                rollOverMeshGroup.children[0].position.set(
                    vect3.x +
                        (Math.floor(rollOverMeshGroup.children[0].geometry.parameters.width / 50) -
                            1) *
                            25,
                    rollOverMeshGroup.children[0].position.y,
                    vect3.z +
                        (Math.floor(rollOverMeshGroup.children[0].geometry.parameters.depth / 50) -
                            1) *
                            25,
                );

                const moveX = rollOverMeshGroup.children[0].position.x - original.x;
                const moveZ = rollOverMeshGroup.children[0].position.z - original.z;
                rollOverMeshGroup.children.forEach((voxel) => {
                    if (voxel !== rollOverMeshGroup.children[0]) {
                        voxel.position.x += moveX;
                        voxel.position.z += moveZ;
                    }
                });
            }
        }
    }

    public moveObjects(
        raycaster: THREE.Raycaster,
        plane: THREE.Object3D[],
        selectedGroup: THREE.Object3D[],
    ): void {
        const intersects = raycaster.intersectObjects(plane, false);

        if (
            intersects.length > 0 &&
            !this.isShiftDown &&
            this.objectSelected &&
            selectedGroup.includes(this.objectSelected)
        ) {
            const intersect = intersects[0];
            // console.log("MOVING1");

            if (intersect.face && this.unitSelected instanceof THREE.Mesh) {
                const original = new THREE.Vector3().copy(this.objectSelected.position);
                const vect3 = new THREE.Vector3().copy(intersect.point).add(intersect.face.normal);
                vect3.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                // const faceHeight = intersect.object

                this.objectSelected.position.set(
                    vect3.x +
                        (Math.floor(this.unitSelected.geometry.parameters.width / 50) - 1) * 25,
                    this.objectSelected.position.y,
                    vect3.z +
                        (Math.floor(this.unitSelected.geometry.parameters.depth / 50) - 1) * 25,
                );

                const moveX = this.objectSelected.position.x - original.x;
                const moveZ = this.objectSelected.position.z - original.z;
                selectedGroup.forEach((voxel) => {
                    if (this.objectSelected && voxel !== this.objectSelected) {
                        voxel.position.x += moveX;
                        voxel.position.z += moveZ;
                    }
                });
            }
        }
    }

    public onPointerUp(): void {
        this.objectSelected = null;
    }

    public onPointerDown(
        raycaster: THREE.Raycaster,
        objects: THREE.Object3D[],
        isCopying: boolean,
        isShiftDown: boolean,
    ): void {
        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 0 && !isCopying) {
            const intersect = intersects[0];
            // console.log(intersect);
            // delete cube

            if (isShiftDown) {
                // console.log(intersect.object);

                if (intersect.object.name !== "plane") {
                    if (intersect.object.parent && intersect.object.parent.name !== "") {
                        if (!this.group.children.includes(intersect.object.parent)) {
                            this.attachObjectToSelectedGroup$.next(intersect.object.parent);
                        }
                    }
                }

                // move group
            } else {
                if (intersect.face) {
                    // console.log("SELECTED", this.objectSelected);

                    if (intersect.object.parent && intersect.object instanceof THREE.Mesh) {
                        this.objectSelected = intersect.object.parent;
                        this.unitSelected = intersect.object;
                    } else {
                        this.objectSelected = null;
                    }
                } else {
                    this.objectSelected = null;
                }
            }
        }

        if (isCopying) {
            this.createCopyGroup$.next(true);
        }
    }

    public onDocumentKeyDown(event: any): void {
        switch (event.keyCode) {
            case 16:
                this.isShiftDown = true;
                break;
        }
    }

    public onDocumentKeyUp(event: any): void {
        switch (event.keyCode) {
            case 16:
                this.isShiftDown = false;
                break;
        }
    }

    public changeLevel(level: number): void {
        // console.log(level);

        if (this.group && !this.isCopying) {
            // this.selectedObject;
            this.group.children.forEach((child) => {
                if (child.name === "cube") {
                    child.position.y += Math.floor(level * 100);
                }
            });
        } else {
            this.rollOverCopyMeshGroup.children.forEach((child) => {
                child.position.y += Math.floor(level * 100);
            });
        }
    }
}
