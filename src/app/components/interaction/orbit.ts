import { Subject } from "rxjs";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export class Orbit {
    controls: OrbitControls;

    raycaster = new THREE.Raycaster();

    pointer = new THREE.Vector2();

    objects: THREE.Object3D[];

    camera: THREE.PerspectiveCamera;

    selectedObject: THREE.Object3D | undefined;

    selectedObject$: Subject<THREE.Object3D> = new Subject();

    constructor(
        camera: THREE.PerspectiveCamera,
        renderer: THREE.Renderer,
        objects: THREE.Object3D[],
    ) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
        this.objects = objects;
        this.camera = camera;
        this.click = this.click.bind(this);
        document.addEventListener("pointerdown", this.click);
    }

    public dispose(): void {
        if (this.selectedObject instanceof THREE.Mesh) {
            this.selectedObject.material.color.set(0xaaaaaa);
        }

        document.removeEventListener("pointerdown", this.click);
        this.controls.dispose();
    }

    private click(event: any): void {
        this.pointer.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
        );

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            if (intersect.object instanceof THREE.Mesh) {
                if (this.selectedObject instanceof THREE.Mesh) {
                    this.selectedObject.material.color.set(0xaaaaaa);
                }

                intersect.object.material.color.set("black");
                this.selectedObject = intersect.object;
                this.selectedObject$.next(intersect.object);
            }
        }
    }

    public setName(name: string): void {
        if (this.selectedObject) {
            this.selectedObject.name = name;
            this.selectedObject$.next(this.selectedObject);
        }
    }
}
