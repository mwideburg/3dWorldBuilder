import { Subject } from "rxjs";
import * as THREE from "three";

import { Cube } from "../units/cube";
// import { Cube } from "../units/cube";
// import { DragControls } from "three/examples/jsm/controls/DragControls";
export class DragAndDrop {
    raycaster = new THREE.Raycaster();

    pointer = new THREE.Vector2();

    camera: THREE.PerspectiveCamera;

    pointerIsDown: boolean = false;

    objects: THREE.Object3D[];

    plane: THREE.Object3D[];

    group: THREE.Group = new THREE.Group();

    scene: THREE.Scene;

    objectSelected: THREE.Object3D | null = null;

    unitSelected: any | null = null;

    isShiftDown: boolean = false;

    rollOverCopyMeshGroup: THREE.Group = new THREE.Group();

    isCopying: boolean = false;

    addObject$: Subject<THREE.Object3D> = new Subject();

    combinedUnits$: Subject<{ add: Cube; remove: THREE.Object3D[] }> = new Subject();

    constructor(
        objects: THREE.Object3D[],
        plane: THREE.Object3D[],
        camera: THREE.PerspectiveCamera,
        scene: THREE.Scene,
    ) {
        this.camera = camera;
        this.objects = objects;
        this.scene = scene;
        this.plane = plane;
        this.scene.add(this.group);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            renderDiv.addEventListener("pointermove", this.onPointerMove);
            renderDiv.addEventListener("pointerdown", this.onPointerDown);
            renderDiv.addEventListener("pointerup", this.onPointerUp);
            document.addEventListener("keydown", this.onDocumentKeyDown);
            document.addEventListener("keyup", this.onDocumentKeyUp);
        }

        this.scene.add(this.rollOverCopyMeshGroup);
    }

    public dispose(): void {
        console.log("DISPOSING DRAG AND DROP");
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            renderDiv.removeEventListener("pointermove", this.onPointerMove);
            renderDiv.removeEventListener("pointerdown", this.onPointerDown);
            renderDiv.removeEventListener("pointerup", this.onPointerUp);
            document.removeEventListener("keydown", this.onDocumentKeyDown);
            document.removeEventListener("keyup", this.onDocumentKeyUp);
        }

        this.group.children.forEach((child) => {
            child.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "Unit") {
                    mesh.material.color.set(0xaaaaaa);
                }
            });
        });
        // this.group = new THREE.Group();
    }

    public disposeTemp(): void {
        console.log("DISPOSING DRAG AND DROP");
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            renderDiv.removeEventListener("pointermove", this.onPointerMove);
            renderDiv.removeEventListener("pointerdown", this.onPointerDown);
            renderDiv.removeEventListener("pointerup", this.onPointerUp);
            document.removeEventListener("keydown", this.onDocumentKeyDown);
            document.removeEventListener("keyup", this.onDocumentKeyUp);
        }

        this.group.children.forEach((child) => {
            child.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "Unit") {
                    mesh.material.color.set(0xaaaaaa);
                }
            });
        });
    }

    public activate(objects: THREE.Object3D[], plane: THREE.Object3D[]): void {
        this.objects = objects;
        this.plane = plane;
        const renderDiv = document.getElementById("renderDiv");
        this.isShiftDown = false;

        if (renderDiv) {
            renderDiv.addEventListener("pointermove", this.onPointerMove);
            renderDiv.addEventListener("pointerdown", this.onPointerDown);
            renderDiv.addEventListener("pointerup", this.onPointerUp);
            document.addEventListener("keydown", this.onDocumentKeyDown);
            document.addEventListener("keyup", this.onDocumentKeyUp);
        }

        this.group.children.forEach((child) => {
            child.children.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh && mesh.name === "Unit") {
                    mesh.material.color.set("red");
                }
            });
        });
    }

    public onPointerMove(event: any): void {
        this.pointer.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.plane, false);

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

        if (
            intersects.length > 0 &&
            !this.isShiftDown &&
            this.pointerIsDown &&
            this.objectSelected
        ) {
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
        this.pointerIsDown = false;
    }

    public onPointerDown(event: any): void {
        this.pointerIsDown = true;
        this.pointer.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0 && !this.isCopying) {
            const intersect = intersects[0];

            // delete cube

            if (this.isShiftDown) {
                console.log(intersect.object);

                if (intersect.object.name !== "plane") {
                    if (intersect.object.parent && intersect.object.parent.name === "cube") {
                        if (!this.group.children.includes(intersect.object.parent)) {
                            if (intersect.object instanceof THREE.Mesh) {
                                intersect.object.material.color.set("red");
                            }

                            this.group.attach(intersect.object.parent);
                        } else {
                            this.scene.attach(intersect.object.parent);

                            if (intersect.object instanceof THREE.Mesh) {
                                intersect.object.material.color.set(0xaaaaaa);
                            }
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

        if (this.isCopying && this.rollOverCopyMeshGroup.children.length > 0) {
            console.log("CLICK COPYING");

            this.rollOverCopyMeshGroup.children.forEach((child: any) => {
                const cube = new Cube({
                    width: child.geometry.parameters.width,
                    height: child.geometry.parameters.height,
                    depth: child.geometry.parameters.depth,
                });

                cube.group.position.set(child.position.x, child.position.y, child.position.z);
                this.objects.push(cube.mesh);
                this.addObject$.next(cube.mesh);

                this.scene.add(cube.group);
            });
            this.scene.remove(this.rollOverCopyMeshGroup);
            this.rollOverCopyMeshGroup = new THREE.Group();
            this.scene.add(this.rollOverCopyMeshGroup);
            this.isCopying = false;
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
        console.log(level);

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

    public combineUnitsIntoOne(): void {
        // comibing units that aren't in a line?
        // add width and depth by taking position and halving the width and depth
        // take min height or max
        if (this.group.children.length !== 2) {
            return;
        }

        const meshes: any[] = [];
        const positions: any[] = [];
        this.group.children.forEach((child: any) => {
            positions.push(child.position);
            child.children.forEach((c: THREE.Mesh) => {
                if (c instanceof THREE.Mesh) {
                    meshes.push(c);
                }
            });
        });
        const dims = { width: 0, depth: 0, height: 100 };
        console.log(meshes);

        if (positions[0].x === positions[1].x) {
            console.log("X's equal");
            dims.width = meshes[0].geometry.parameters.width;
            dims.depth = meshes[0].geometry.parameters.depth + meshes[1].geometry.parameters.depth;
        } else {
            dims.depth = meshes[0].geometry.parameters.depth;
            dims.width = meshes[0].geometry.parameters.width + meshes[1].geometry.parameters.width;
        }

        const cube = new Cube(dims);
        const position = new THREE.Vector3().add(positions[0]).add(positions[1]).divideScalar(2);
        cube.group.position.set(position.x, position.y, position.z);
        console.log("Objects BEFORE", this.objects);
        console.log("Meshes", meshes);
        this.objects = this.objects.filter((obj) => {
            return !meshes.includes(obj);
        });
        this.scene.remove(this.group);
        this.objects.push(cube.mesh);
        this.combinedUnits$.next({
            add: cube,
            remove: this.group.children,
        });
        console.log("OBJECTs", this.objects);

        this.group = new THREE.Group();
        this.scene.add(this.group);
        console.log("COMBINE UNITS");
    }

    public copyGroupOfUnits(): void {
        this.group.children.forEach((child: any) => {
            child.children.forEach((mesh: any) => {
                if (mesh.name === "Unit") {
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
}
