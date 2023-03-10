/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as THREE from "three";
// import { Orbit } from "../interaction/orbit";

import { Injectable, NgZone } from "@angular/core";
import { ControllerService } from "../controller/controller.service";

@Injectable({ providedIn: "root" })
export class RenderEngine {
    canvas!: HTMLElement;

    scene!: THREE.Scene;

    camera!: THREE.PerspectiveCamera;

    renderer!: THREE.WebGLRenderer;

    controllerService!: ControllerService;

    requestAnimation: boolean = false;

    constructor(private ngZone: NgZone) {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        const renderDiv = document.getElementById("renderDiv");

        if (renderDiv) {
            renderDiv.appendChild(renderer.domElement);
        }

        this.renderer = renderer;
        this.canvas = this.renderer.domElement;
        // this.render = this.render.bind(this);
        // this.onWindowResize = this.onWindowResize.bind(this);
        // window.addEventListener("resize", this.onWindowResize);
        this.render = this.render.bind(this);
        this.requestRenderIfNotRequested = this.requestRenderIfNotRequested.bind(this);
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

        if (this.controllerService.interactionService.controls) {
            // this.controllerService.interactionService.controls.update();
            this.controllerService.interactionService.controls.addEventListener(
                "change",
                this.requestRenderIfNotRequested,
            );
        }

        this.animate();
        this.requestRenderIfNotRequested();
    }

    // render(): void {
    //     requestAnimationFrame(this.render);

    //     if (this.controllerService.interactionService.controls) {
    //         this.controllerService.interactionService.controls.update();
    //     }

    //     this.renderer.render(this.scene, this.camera);
    // }

    public animate(): void {
        // We have to run this outside angular zones,
        // because it could trigger heavy changeDetection cycles.
        this.ngZone.runOutsideAngular(() => {
            if (document.readyState !== "loading") {
                this.render();
            } else {
                window.addEventListener("DOMContentLoaded", () => {
                    this.render();
                });
            }

            if (this.controllerService.interactionService.controls) {
                // this.controllerService.interactionService.controls.update();
                this.controllerService.interactionService.controls.addEventListener(
                    "change",
                    this.requestRenderIfNotRequested,
                );
            }

            window.addEventListener("resize", () => {
                this.resize();
            });
        });
    }

    public render(): void {
        this.requestAnimation = false;

        if (this.controllerService.interactionService.controls) {
            this.controllerService.interactionService.controls.update();
        }

        this.camera.updateProjectionMatrix();

        this.renderer?.render(this.scene, this.camera);
    }

    public requestRenderIfNotRequested(): void {
        // console.log("REQUEST");

        if (!this.requestAnimation && this.renderer) {
            this.requestAnimation = true;
            requestAnimationFrame(this.render);
        }
    }

    public resize(): void {
        const element = this.canvas;

        if (this.scene && this.renderer && this.camera && element) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }

        this.requestRenderIfNotRequested();
    }

    onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
}
