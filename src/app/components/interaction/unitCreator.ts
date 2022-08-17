import { Subject } from "rxjs";
import * as THREE from "three";
import { Cube } from "../units/cube";
import { Dimension } from "../types/dimensionType";
export class UnitCreator {
    raycaster = new THREE.Raycaster();

    pointer = new THREE.Vector2();

    camera: THREE.PerspectiveCamera;

    rollOverMesh: THREE.Mesh;

    objects: THREE.Object3D[];

    addObject$: Subject<THREE.Object3D> = new Subject();

    removeObject$: Subject<THREE.Object3D> = new Subject();

    scene: THREE.Scene;

    isShiftDown: boolean = false;

    dimensions: Dimension;

    constructor(camera: THREE.PerspectiveCamera, objects: THREE.Object3D[], scene: THREE.Scene) {
        this.dimensions = {
            width: 100,
            height: 100,
            depth: 100,
        };
        this.camera = camera;
        this.objects = objects;
        this.scene = scene;
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            this.onPointerMove = this.onPointerMove.bind(this);
            this.onPointerDown = this.onPointerDown.bind(this);
            this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
            this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
            this.setDimensions = this.setDimensions.bind(this);
            renderDiv.addEventListener("pointermove", this.onPointerMove);
            renderDiv.addEventListener("pointerdown", this.onPointerDown);
            document.addEventListener("keydown", this.onDocumentKeyDown);
            document.addEventListener("keyup", this.onDocumentKeyUp);
        }

        const rollOverGeo = new THREE.BoxGeometry(
            this.dimensions.width,
            this.dimensions.height,
            this.dimensions.depth,
        );
        const rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true,
        });

        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.scene.add(this.rollOverMesh);
    }

    public activate(): void {
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            renderDiv.addEventListener("pointermove", this.onPointerMove);
            renderDiv.addEventListener("pointerdown", this.onPointerDown);
            document.addEventListener("keydown", this.onDocumentKeyDown);
            document.addEventListener("keyup", this.onDocumentKeyUp);
        }

        const rollOverGeo = new THREE.BoxGeometry(
            this.dimensions.width,
            this.dimensions.height,
            this.dimensions.depth,
        );
        const rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true,
        });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.scene.add(this.rollOverMesh);
    }

    public dispose(): void {
        console.log("DISPOSING UNIT CREATOR");
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            renderDiv.removeEventListener("pointermove", this.onPointerMove);
            renderDiv.removeEventListener("pointerdown", this.onPointerDown);
            document.removeEventListener("keydown", this.onDocumentKeyDown);
            document.removeEventListener("keyup", this.onDocumentKeyUp);
        }

        this.isShiftDown = false;
        this.scene.remove(this.rollOverMesh);
    }

    public setDimensions(dimensions: Dimension): void {
        this.scene.remove(this.rollOverMesh);
        console.log(dimensions);
        this.dimensions = dimensions;
        const rollOverGeo = new THREE.BoxGeometry(
            this.dimensions.width,
            this.dimensions.height,
            this.dimensions.depth,
        );
        const rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true,
        });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.scene.add(this.rollOverMesh);
    }

    private onPointerMove(event: any): void {
        this.pointer.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            if (intersect.face) {
                if (intersect.object.name === "plane") {
                    const vect3 = new THREE.Vector3()
                        .copy(intersect.point)
                        .add(intersect.face.normal);
                    vect3.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    // const faceHeight = intersect.object

                    this.rollOverMesh.position.set(
                        vect3.x + (Math.floor(this.dimensions.width / 50) - 1) * 25,
                        vect3.y + (Math.floor(this.dimensions.height / 50) - 1) * 25,
                        vect3.z + (Math.floor(this.dimensions.depth / 50) - 1) * 25,
                    );
                }

                if (intersect.object.name === "Unit") {
                    const vect3 = new THREE.Vector3()
                        .copy(intersect.point)
                        .add(intersect.face.normal);
                    vect3.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    // const faceHeight = intersect.object

                    this.rollOverMesh.position.set(
                        vect3.x + (Math.floor(this.dimensions.width / 50) - 1) * 25,
                        vect3.y + (Math.floor(this.dimensions.height / 50) - 1) * 25,
                        vect3.z + (Math.floor(this.dimensions.depth / 50) - 1) * 25,
                    );
                }
            }
        }
    }

    private onPointerDown(event: any): void {
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
                console.log("SHIFT IS DOWN");

                if (intersect.object.name !== "plane") {
                    if (intersect.object.parent && intersect.object.parent.name === "cube") {
                        this.scene.remove(intersect.object.parent);

                        this.objects.splice(this.objects.indexOf(intersect.object), 1);
                        this.removeObject$.next(intersect.object);
                    }
                }

                // create cube
            } else {
                const voxel = new Cube(this.dimensions);

                if (intersect.face) {
                    console.log(intersect);
                    const vect3 = new THREE.Vector3()
                        .copy(intersect.point)
                        .add(intersect.face.normal);
                    vect3.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    voxel.group.position.set(
                        vect3.x + (Math.floor(this.dimensions.width / 50) - 1) * 25,
                        vect3.y + (Math.floor(this.dimensions.height / 50) - 1) * 25,
                        vect3.z + (Math.floor(this.dimensions.depth / 50) - 1) * 25,
                    );

                    this.scene.add(voxel.group);
                }

                this.addObject$.next(voxel.mesh);
                this.objects.push(voxel.mesh);
            }
        }
    }

    private onDocumentKeyDown(event: any): void {
        switch (event.keyCode) {
            case 16:
                this.isShiftDown = true;
                console.log(this.isShiftDown);
                break;
        }
    }

    private onDocumentKeyUp(event: any): void {
        switch (event.keyCode) {
            case 16:
                this.isShiftDown = false;

                break;
        }
    }

    public swapOrientation(): void {
        this.dimensions = {
            width: this.dimensions.depth,
            depth: this.dimensions.width,
            height: this.dimensions.height,
        };
        const rollOverGeo = new THREE.BoxGeometry(
            this.dimensions.width,
            this.dimensions.height,
            this.dimensions.depth,
        );
        const rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true,
        });
        this.scene.remove(this.rollOverMesh);
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.scene.add(this.rollOverMesh);
    }
}
