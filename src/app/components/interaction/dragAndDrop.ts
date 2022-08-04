import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
export class DragAndDrop {
    controls: DragControls;

    enableSelection: boolean = false;

    mouse = new THREE.Vector2();

    raycaster = new THREE.Raycaster();

    camera: THREE.PerspectiveCamera;

    objects: THREE.Object3D[];

    group: THREE.Group;

    scene: THREE.Scene;

    constructor(
        objects: THREE.Object3D[],
        camera: THREE.PerspectiveCamera,
        renderer: THREE.Renderer,
        scene: THREE.Scene,
    ) {
        this.objects = objects;
        this.controls = new DragControls([...objects], camera, renderer.domElement);
        this.camera = camera;
        this.group = new THREE.Group();
        this.scene = scene;
        this.scene.add(this.group);
        document.addEventListener("click", this.onClick);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    public dispose(): void {
        document.removeEventListener("click", this.onClick);
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        this.scene.remove(this.group);
        this.controls.dispose();
    }

    private onClick(event: any): void {
        event.preventDefault();

        if (this.enableSelection === true) {
            const draggableObjects = this.controls.getObjects();
            draggableObjects.length = 0;

            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            const intersections = this.raycaster.intersectObjects(this.objects, true);

            if (intersections.length > 0) {
                const object: any = intersections[0].object;

                if (this.group.children.includes(object) === true) {
                    object.material.emissive.set(0x000000);
                    this.scene.attach(object);
                } else {
                    object.material.emissive.set(0xaaaaaa);
                    this.group.attach(object);
                }

                this.controls.transformGroup = true;
                draggableObjects.push(this.group);
            }

            if (this.group.children.length === 0) {
                this.controls.transformGroup = false;
                draggableObjects.push(...this.objects);
            }
        }
    }

    private onKeyDown(event: any): void {
        this.enableSelection = event.keyCode === 16 ? true : false;
    }

    private onKeyUp(): void {
        this.enableSelection = false;
    }
}
