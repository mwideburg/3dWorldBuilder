import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export class Orbit {
    controls: OrbitControls;

    constructor(camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = true;
    }

    public dispose(): void {
        this.controls.dispose();
    }
}
