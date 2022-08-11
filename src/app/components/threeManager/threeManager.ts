import * as THREE from "three";
import { Injectable } from "@angular/core";
import { ControllerService } from "../controller/controller.service";
import { RenderEngine } from "../renderer/renderEngine";
@Injectable({ providedIn: "root" })
export class ThreeManager {
    scene: THREE.Scene = new THREE.Scene();

    camera: THREE.PerspectiveCamera;

    constructor(public renderEngine: RenderEngine, private controllerService: ControllerService) {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            10000,
        );
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);
        const gridHelper = new THREE.GridHelper(1000, 20);
        this.scene.add(gridHelper);
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        geometry.rotateX(-Math.PI / 2);

        const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        plane.name = "plane";
        this.scene.add(plane);

        this.renderEngine.createRenderEngine(this.scene, this.camera);
        this.controllerService.createController(
            this.camera,
            plane,
            this.renderEngine.renderer,
            this.scene,
        );
        this.renderEngine.addControllerService(this.controllerService);
    }
}
