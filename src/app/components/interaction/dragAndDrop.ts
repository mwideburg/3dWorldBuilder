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

    objectIsSelected: boolean = false;

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
        // const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
        // const rollOverMaterial = new THREE.MeshBasicMaterial({
        //     color: 0xff0000,
        //     opacity: 0.5,
        //     transparent: true,
        // });
        // this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        // this.scene.add(this.rollOverMesh);
    }

    public dispose(): void {
        console.log("DISPOSING DRAG AND DROP");
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerdown", this.onPointerDown);
        document.removeEventListener("keydown", this.onDocumentKeyDown);
        document.removeEventListener("keyup", this.onDocumentKeyUp);
    }

    public onPointerMove(event: any): void {
        this.pointer.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.plane, false);

        if (intersects.length > 0 && this.pointerIsDown && this.objectIsSelected) {
            const intersect = intersects[0];

            if (intersect.face) {
                this.group.position.copy(intersect.point).add(intersect.face.normal);
                this.group.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
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

                            this.group.add(intersect.object.parent);
                        } else {
                            // this.group.remove(intersect.object.parent);

                            if (intersect.object instanceof THREE.Mesh) {
                                intersect.object.material.color.set("gray");
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
                        this.group.children.includes(intersect.object.parent)
                    ) {
                        this.objectIsSelected = true;
                    } else {
                        // const voxel = intersect.object;
                        // voxel.position.copy(intersect.point).add(intersect.face.normal);
                        // voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    }
                } else {
                    this.objectIsSelected = false;
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
}
