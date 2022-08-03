import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
export class DragAndDrop {
    controls: DragControls;

    constructor(
        objects: THREE.Object3D[],
        camera: THREE.PerspectiveCamera,
        renderer: THREE.Renderer,
    ) {
        this.controls = new DragControls([...objects], camera, renderer.domElement);
        document.addEventListener("click", this.onClick);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }
}
