import { Component, ViewChild, AfterViewInit } from "@angular/core";
import * as THREE from "three";
// import { Orbit } from "../interaction/orbit";
// import { ControllerService } from "../controller/controller.service";
import { ThreeManager } from "../threeManager/threeManager";

@Component({
    selector: "app-canvas",
    templateUrl: "./canvas.component.html",
    styleUrls: ["./canvas.component.scss"],
})
export class CanvasComponent implements AfterViewInit {
    @ViewChild("renderCanvas", { static: true })
    // public rendererCanvas: ElementRef<HTMLCanvasElement>;
    public scene: THREE.Scene = new THREE.Scene();

    // public controllerService: ControllerService;

    constructor(private threeManager: ThreeManager) {
        // const scene = new THREE.Scene();
        // this.scene = scene;
        // const camera = new THREE.PerspectiveCamera(
        //     45,
        //     window.innerWidth / window.innerHeight,
        //     1,
        //     10000,
        // );
        // const renderer = new THREE.WebGLRenderer();
        // renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild(renderer.domElement);
        // this.scene.add(camera);
        // this.scene.background = new THREE.Color("white");
        // camera.position.set(500, 800, 1300);
        // camera.lookAt(0, 0, 0);
        // const gridHelper = new THREE.GridHelper(1000, 20);
        // this.scene.add(gridHelper);
        // const geometry = new THREE.PlaneGeometry(1000, 1000);
        // geometry.rotateX(-Math.PI / 2);
        // const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        // plane.name = "plane";
        // this.scene.add(plane);
        // const controllerServerice = new ControllerService(camera, plane, renderer, scene);
        // this.controllerService = controllerServerice;
        // const render = (): void => {
        //     requestAnimationFrame(render);
        //     if (controllerServerice.currentController instanceof Orbit) {
        //         controllerServerice.currentController.controls.update();
        //     }
        //     renderer.render(this.scene, camera);
        // };
        // function onWindowResize(): void {
        //     camera.aspect = window.innerWidth / window.innerHeight;
        //     camera.updateProjectionMatrix();
        //     renderer.setSize(window.innerWidth, window.innerHeight);
        //     render();
        // }
        // window.addEventListener("resize", onWindowResize);
        // render();
        console.log(this.threeManager);
    }

    ngAfterViewInit(): void {
        console.log("START");
        this.threeManager.renderEngine.render();
        // if (!this.rendererCanvas) {
        //     return;
        // }
    }
}
