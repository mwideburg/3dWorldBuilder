import * as THREE from "three";
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
        document.addEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointerdown", this.onPointerDown);
        document.addEventListener("pointerup", this.onPointerUp);
        document.addEventListener("keydown", this.onDocumentKeyDown);
        document.addEventListener("keyup", this.onDocumentKeyUp);
    }

    public dispose(): void {
        console.log("DISPOSING DRAG AND DROP");
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerdown", this.onPointerDown);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.removeEventListener("keydown", this.onDocumentKeyDown);
        document.removeEventListener("keyup", this.onDocumentKeyUp);
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
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerdown", this.onPointerDown);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.removeEventListener("keydown", this.onDocumentKeyDown);
        document.removeEventListener("keyup", this.onDocumentKeyUp);
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
        document.addEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointerdown", this.onPointerDown);
        document.addEventListener("pointerup", this.onPointerUp);
        document.addEventListener("keydown", this.onDocumentKeyDown);
        document.addEventListener("keyup", this.onDocumentKeyUp);
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
                // this.objectSelected.position.copy(intersect.point).add(intersect.face.normal);
                // console.log(this.objectSelected);
                // this.objectSelected.position
                //     .divideScalar(50)
                //     .floor()
                //     .multiplyScalar(50)
                //     .addScalar(25);
                // this.objectSelected.position.y = original.y;

                // console.log(this.objectSelected);
                const moveX = this.objectSelected.position.x - original.x;
                const moveZ = this.objectSelected.position.z - original.z;
                this.group.children.forEach((voxel) => {
                    if (this.objectSelected && voxel !== this.objectSelected) {
                        console.log(voxel.position);
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

        if (intersects.length > 0) {
            const intersect = intersects[0];

            // delete cube

            if (this.isShiftDown) {
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

                // create cube
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

        if (this.group) {
            // this.selectedObject;
            this.group.children.forEach((child) => {
                if (child.name === "cube") {
                    child.position.y += Math.floor(level * 100);
                }
            });
        }
    }
}
