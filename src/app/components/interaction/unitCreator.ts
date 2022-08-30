import { Subject } from "rxjs";
import * as THREE from "three";
import { Cube } from "../units/cube";
import { Dimension } from "../types/dimensionType";
export class UnitCreator {
    raycaster = new THREE.Raycaster();

    pointer = new THREE.Vector2();

    camera: THREE.PerspectiveCamera;

    rollOverMesh: THREE.Mesh;

    addObject$: Subject<THREE.Object3D> = new Subject();

    removeObject$: Subject<THREE.Object3D> = new Subject();

    // isShiftDown: boolean = false;

    dimensions: Dimension;

    constructor(camera: THREE.PerspectiveCamera) {
        this.dimensions = {
            width: 100,
            height: 100,
            depth: 100,
        };
        this.camera = camera;

        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            this.onPointerMove = this.onPointerMove.bind(this);

            this.setDimensions = this.setDimensions.bind(this);
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
        this.rollOverMesh.name = "rollOverMesh";
        this.addObject$.next(this.rollOverMesh);
    }

    public activate(): void {
        console.log("ACTIVATING CREATOR");

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
        this.rollOverMesh.name = "rollOverMesh";
        this.addObject$.next(this.rollOverMesh);
    }

    public disable(): void {
        this.removeObject$.next(this.rollOverMesh);
    }

    public setDimensions(dimensions: Dimension): void {
        // console.log(dimensions);
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
        this.removeObject$.next(this.rollOverMesh);
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.addObject$.next(this.rollOverMesh);
    }

    public onPointerMove(raycaster: THREE.Raycaster, objects: THREE.Object3D[]): void {
        const intersects = raycaster.intersectObjects(objects, false);
        // console.log(objects);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            if (intersect.face) {
                // const addXAxis = (this.dimensions.width / 2) % 50;
                // const addZAxis = (this.dimensions.depth / 2) % 50;

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

                if (intersect.object.name === "cube") {
                    if (intersect.face) {
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
    }

    public click(
        raycaster: THREE.Raycaster,
        isShiftDown: boolean,
        objects: THREE.Object3D[],
    ): void {
        // console.log(this.objects);
        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            // console.log(intersects);
            // delete cube

            if (isShiftDown) {
                console.log("SHIFT IS DOWN");

                if (intersect.object.name !== "plane") {
                    if (intersect.object.parent && intersect.object.parent.name === "unit") {
                        // console.log(intersect.object.parent.name);
                        // this.scene.remove(intersect.object.parent);

                        // this.objects.splice(this.objects.indexOf(intersect.object), 1);
                        this.removeObject$.next(intersect.object.parent);
                    }
                }

                // create cube
            } else {
                const voxel = new Cube(this.dimensions);
                // console.log(intersect);

                if (intersect.face) {
                    // console.log(intersect);
                    const vect3 = new THREE.Vector3()
                        .copy(intersect.point)
                        .add(intersect.face.normal);
                    vect3.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

                    // const addXAxis = (this.dimensions.width / 2) % 50;
                    // const addZAxis = (this.dimensions.depth / 2) % 50;
                    // console.log(addXAxis, addZAxis);
                    voxel.group.position.set(
                        vect3.x + (Math.floor(this.dimensions.width / 50) - 1) * 25,
                        vect3.y + (Math.floor(this.dimensions.height / 50) - 1) * 25,
                        vect3.z + (Math.floor(this.dimensions.depth / 50) - 1) * 25,
                    );

                    // this.scene.add(voxel.group);
                }

                this.addObject$.next(voxel.group);
                // this.objects.push(voxel.mesh);
            }
        }
    }

    public swapOrientation(): void {
        console.log("SWAPPING");
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
        this.removeObject$.next(this.rollOverMesh);
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
        this.addObject$.next(this.rollOverMesh);
    }
}
