import { Subject } from "rxjs";
// import * as THREE from "three";
import * as THREE from "three";
// import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
// import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper";
import { Cube } from "../units/cube";
// import { Cube } from "../units/cube";
// import { DragControls } from "three/examples/jsm/controls/DragControls";
export class Selector {
    camera: THREE.PerspectiveCamera;

    group: THREE.Group = new THREE.Group();

    objectSelected: THREE.Object3D | null = null;

    unitSelected: any | null = null;

    isShiftDown: boolean = false;

    rollOverCopyMeshGroup: THREE.Group = new THREE.Group();

    isCopying: boolean = false;

    addObject$: Subject<THREE.Object3D> = new Subject();

    attachObjectToSelectedGroup$: Subject<THREE.Object3D> = new Subject();

    attachObjectToScene$: Subject<THREE.Object3D> = new Subject();

    combinedUnits$: Subject<{ add: Cube; remove: THREE.Object3D[] }> = new Subject();

    constructor(camera: THREE.PerspectiveCamera) {
        // this.renderer = renderer;
        this.camera = camera;

        // this.selectionBox = selectionBox;
        // this.selectionHelper = selectionHelper;
        // this.selectionBox = new SelectionBox(this.camera, this.scene);
        // this.selectionHelper = new SelectionHelper(this.selectionBox, this.renderer, "select Box");

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
        moveIsEnabled: boolean,
        shiftIsDown: boolean,
    ): void {
        const intersects = raycaster.intersectObjects(plane, false);

        if (
            intersects.length > 0 &&
            this.isCopying &&
            this.rollOverCopyMeshGroup.children[0] instanceof THREE.Mesh
        ) {
            const intersect = intersects[0];

            if (intersect.face) {
                const original = new THREE.Vector3().copy(
                    this.rollOverCopyMeshGroup.children[0].position,
                );
                const vect3 = new THREE.Vector3().copy(intersect.point).add(intersect.face.normal);
                vect3.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                // const faceHeight = intersect.object

                this.rollOverCopyMeshGroup.children[0].position.set(
                    vect3.x +
                        (Math.floor(
                            this.rollOverCopyMeshGroup.children[0].geometry.parameters.width / 50,
                        ) -
                            1) *
                            25,
                    this.rollOverCopyMeshGroup.children[0].position.y,
                    vect3.z +
                        (Math.floor(
                            this.rollOverCopyMeshGroup.children[0].geometry.parameters.depth / 50,
                        ) -
                            1) *
                            25,
                );

                const moveX = this.rollOverCopyMeshGroup.children[0].position.x - original.x;
                const moveZ = this.rollOverCopyMeshGroup.children[0].position.z - original.z;
                this.rollOverCopyMeshGroup.children.forEach((voxel) => {
                    if (voxel !== this.rollOverCopyMeshGroup.children[0]) {
                        voxel.position.x += moveX;
                        voxel.position.z += moveZ;
                    }
                });
            }
        }

        if (intersects.length > 0 && !shiftIsDown && moveIsEnabled && this.objectSelected) {
            const intersect = intersects[0];

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
                this.group.children.forEach((voxel) => {
                    if (this.objectSelected && voxel !== this.objectSelected) {
                        voxel.position.x += moveX;
                        voxel.position.z += moveZ;
                    }
                });
            }
        }
    }

    public onPointerUp(): void {
        // this.pointerIsDown = false;
        // this.selectionBox.endPoint.set(
        //     (event.clientX / window.innerWidth) * 2 - 1,
        //     -(event.clientY / window.innerHeight) * 2 + 1,
        //     0.5,
        // );
        // const allSelected = this.selectionBox.select();
        // allSelected.forEach((item: any) => {
        //     if (item.material) {
        //         item.material.emissive.set(0x000000);
        //     }
        // });
    }

    public onPointerDown(
        raycaster: THREE.Raycaster,
        objects: THREE.Object3D[],
        isCopying: boolean,
        isShiftDown: boolean,
    ): void {
        // this.pointerIsDown = true;
        // this.pointer.set(
        //     (event.clientX / window.innerWidth) * 2 - 1,
        //     -(event.clientY / window.innerHeight) * 2 + 1,
        // );

        // this.selectionBox.collection.forEach((item: any) => {
        //     if (item.material) {
        //         item.material.emissive.set(0x000000);
        //     }
        // });

        // this.selectionBox.startPoint.set(
        //     (event.clientX / window.innerWidth) * 2 - 1,
        //     -(event.clientY / window.innerHeight) * 2 + 1,
        //     0.5,
        // );

        // this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 0 && !isCopying) {
            const intersect = intersects[0];
            console.log(intersect);
            // delete cube

            if (isShiftDown) {
                console.log(intersect.object);

                if (intersect.object.name !== "plane") {
                    if (intersect.object.parent && intersect.object.parent.name === "unit") {
                        if (!this.group.children.includes(intersect.object.parent)) {
                            // if (intersect.object instanceof THREE.Mesh) {
                            //     intersect.object.material.color.set("red");
                            // }

                            console.log("CLICK", this.group);
                            this.attachObjectToSelectedGroup$.next(intersect.object.parent);
                            // this.group.attach(intersect.object.parent);
                        }
                    }
                }

                // move group
            } else {
                if (intersect.face) {
                    if (
                        this.group.children.length > 0 &&
                        intersect.object.parent &&
                        this.group.children.includes(intersect.object.parent) &&
                        intersect.object instanceof THREE.Mesh
                    ) {
                        this.objectSelected = intersect.object.parent;
                        this.unitSelected = intersect.object;
                    } else {
                        this.objectSelected = null;
                        // const voxel = intersect.object;
                        // voxel.position.copy(intersect.point).add(intersect.face.normal);
                        // voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    }
                } else {
                    this.objectSelected = null;
                }
            }
        }

        if (isCopying && this.rollOverCopyMeshGroup.children.length > 0) {
            console.log("CLICK COPYING");

            this.rollOverCopyMeshGroup.children.forEach((child: any) => {
                const cube = new Cube({
                    width: child.geometry.parameters.width,
                    height: child.geometry.parameters.height,
                    depth: child.geometry.parameters.depth,
                });

                cube.group.position.set(child.position.x, child.position.y, child.position.z);
                // this.objects.push(cube.mesh);
                this.addObject$.next(cube.group);

                // this.scene.add(cube.group);
            });
            this.rollOverCopyMeshGroup.clear();
        }
    }

    public removeObjectFromGroup(raycaster: THREE.Raycaster, objects: THREE.Object3D[]): void {
        // const intersects = raycaster.intersectObjects(objects, false);
        // if (intersects.length > 0) {
        //     const intersect = intersects[0];
        //     console.log(intersect);
        //     if (intersect.object.name !== "plane") {
        //         if (intersect.object.parent && intersect.object.parent.name === "unit") {
        //             this.attachObjectToScene$.next(intersect.object.parent);
        //             console.log("REMOVING");
        //         }
        //     }
        // }

        console.log(raycaster, objects);
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

    public combineUnitsIntoOne(group: THREE.Object3D): void {
        console.log(group);
        // comibing units that aren't in a line?
        // add width and depth by taking position and halving the width and depth
        // take min height or max
        // if (this.group.children.length !== 2) {
        //     return;
        // }
        // const meshes: any[] = [];
        // const positions: any[] = [];
        // this.group.children.forEach((child: any) => {
        //     positions.push(child.position);
        //     child.children.forEach((c: THREE.Mesh) => {
        //         if (c instanceof THREE.Mesh) {
        //             meshes.push(c);
        //         }
        //     });
        // });
        // const dims = { width: 0, depth: 0, height: 100 };
        // // console.log(meshes);
        // if (positions[0].x === positions[1].x) {
        //     // console.log("X's equal");
        //     dims.width = meshes[0].geometry.parameters.width;
        //     dims.depth = meshes[0].geometry.parameters.depth + meshes[1].geometry.parameters.depth;
        // } else {
        //     dims.depth = meshes[0].geometry.parameters.depth;
        //     dims.width = meshes[0].geometry.parameters.width + meshes[1].geometry.parameters.width;
        // }
        // const cube = new Cube(dims);
        // const position = new THREE.Vector3().add(positions[0]).add(positions[1]).divideScalar(2);
        // cube.group.position.set(position.x, position.y, position.z);
        // console.log("Objects BEFORE", this.objects);
        // console.log("Meshes", meshes);
        // this.objects = this.objects.filter((obj) => {
        //     return !meshes.includes(obj);
        // });
        // this.scene.remove(this.group);
        // this.objects.push(cube.mesh);
        // this.combinedUnits$.next({
        //     add: cube,
        //     remove: this.group.children,
        // });
        // console.log("OBJECTs", this.objects);
        // this.group = new THREE.Group();
        // this.scene.add(this.group);
        // console.log("COMBINE UNITS");
    }

    public copyGroupOfUnits(): void {
        this.group.children.forEach((child: any) => {
            child.children.forEach((mesh: any) => {
                if (mesh.name === "cube") {
                    const rollOverGeo = new THREE.BoxGeometry(
                        mesh.geometry.parameters.width,
                        mesh.geometry.parameters.height,
                        mesh.geometry.parameters.depth,
                    );
                    const rollOverMaterial = new THREE.MeshBasicMaterial({
                        color: 0xff0000,
                        opacity: 0.5,
                        transparent: true,
                    });

                    const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
                    rollOverMesh.position.set(child.position.x, child.position.y, child.position.z);
                    this.rollOverCopyMeshGroup.add(rollOverMesh);
                }
            });
        });
        this.isCopying = true;
        // this.scene.add(this.rollOverCopyMeshGroup);
        console.log("COPYING UNITS");
    }

    public deselectAll(): void {
        // console.log(this.group);
        // const children: any[] = [];
        // this.group.children.forEach((child) => {
        //     children.push(child);
        //     child.children.forEach((c) => {
        //         if (c instanceof THREE.Mesh) {
        //             c.material.color.set(0xaaaaaa);
        //         }
        //     });
        // });
        // children.forEach((c) => this.scene.attach(c));
        // console.log(this.group);
        // this.objectSelected = null;
    }
}
