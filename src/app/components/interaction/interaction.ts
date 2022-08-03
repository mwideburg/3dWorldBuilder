import * as THREE from "three";
export class UnitCreator {
    raycaster = new THREE.Raycaster();

    pointer = new THREE.Vector2();

    camera: THREE.PerspectiveCamera;

    rollOverMesh: THREE.Mesh;

    objects: THREE.Object3D[];

    constructor(camera: THREE.PerspectiveCamera, objects: THREE.Object3D[]) {
        this.camera = camera;
        this.objects = objects;
        this.onPointerMove = this.onPointerMove.bind(this);
        document.addEventListener("pointermove", this.onPointerMove);
        // document.addEventListener("pointerdown", onPointerDown);
        // document.addEventListener("keydown", onDocumentKeyDown);
        // document.addEventListener("keyup", onDocumentKeyUp);
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
}
