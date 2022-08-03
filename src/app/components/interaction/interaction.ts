import { Subject } from "rxjs";
import * as THREE from "three";
import { Cube } from "../units/cube";
export class UnitCreator {
    raycaster = new THREE.Raycaster();

    pointer = new THREE.Vector2();

    camera: THREE.PerspectiveCamera;

    rollOverMesh: THREE.Mesh;

    objects: THREE.Object3D[];

    addObject$: Subject<THREE.Object3D> = new Subject();

    removeObject$: Subject<THREE.Object3D> = new Subject();

    isShiftDown: boolean = false;

    constructor(camera: THREE.PerspectiveCamera, objects: THREE.Object3D[]) {
        this.camera = camera;
        this.objects = objects;
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
        this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
        document.addEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointerdown", this.onPointerDown);
        document.addEventListener("keydown", this.onDocumentKeyDown);
        document.addEventListener("keyup", this.onDocumentKeyUp);
        const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
        const rollOverMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0.5,
            transparent: true,
        });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    }

    private onPointerMove(event: any): void {
        console.log(this);
        this.pointer.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            if (intersect.face) {
                this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                this.rollOverMesh.position
                    .divideScalar(50)
                    .floor()
                    .multiplyScalar(50)
                    .addScalar(25);
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
                if (intersect.object.name !== "plane") {
                    this.removeObject$.next(intersect.object);

                    this.objects.splice(this.objects.indexOf(intersect.object), 1);
                }

                // create cube
            } else {
                const voxel = new Cube();
                console.log(voxel);

                if (intersect.face) {
                    voxel.mesh.position.copy(intersect.point).add(intersect.face.normal);
                    voxel.mesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    this.addObject$.next(voxel.mesh);
                }

                this.objects.push(voxel.mesh);
            }
        }
    }

    private onDocumentKeyDown(event: any): void {
        switch (event.keyCode) {
            case 16:
                this.isShiftDown = true;
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
}
