/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as THREE from "three";
import { Orbit } from "../interaction/orbit";

import { Injectable, NgZone } from "@angular/core";
import { ControllerService } from "../controller/controller.service";

@Injectable({ providedIn: "root" })
export class RenderEngine {
    canvas!: HTMLElement;

    scene!: THREE.Scene;

    camera!: THREE.PerspectiveCamera;

    renderer!: THREE.WebGLRenderer;

    controllerService!: ControllerService;

    constructor(private ngZone: NgZone) {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            renderDiv.appendChild(renderer.domElement);
        }

        this.renderer = renderer;
        this.canvas = this.renderer.domElement;
        this.render = this.render.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener("resize", this.onWindowResize);
    }

    onInit(): void {}

    createRenderEngine(
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        // canvas: HTMLCanvasElement,
    ): void {
        // this.renderer = new THREE.WebGLRenderer({
        //     canvas,
        //     alpha: true, // transparent background
        //     antialias: true, // smooth edges
        // });
        this.scene = scene;
        this.camera = camera;
    }

    addControllerService(controllerService: ControllerService): void {
        this.controllerService = controllerService;
    }

    render(): void {
        requestAnimationFrame(this.render);

        if (this.controllerService && this.controllerService.currentController instanceof Orbit) {
            this.controllerService.currentController.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
}
