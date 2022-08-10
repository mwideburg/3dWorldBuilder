import { Injectable, Inject } from "@angular/core";
import * as THREE from "three";
import { UnitCreator } from "../interaction/unitCreator";
import { Orbit } from "../interaction/orbit";
import { DragAndDrop } from "../interaction/dragAndDrop";
import { Subject } from "rxjs";
@Injectable({
    providedIn: "root",
})
export class ControllerService {
    scene: THREE.Scene;

    camera: THREE.PerspectiveCamera;

    renderer: THREE.WebGLRenderer;

    plane: THREE.Object3D;

    currentController: Orbit | UnitCreator | DragAndDrop;

    unitCreator: UnitCreator;

    currentController$: Subject<string> = new Subject();

    constructor(
        camera: THREE.PerspectiveCamera,
        plane: THREE.Object3D,
        @Inject(THREE.WebGLRenderer) renderer: THREE.WebGLRenderer,
        @Inject(THREE.Scene) scene: THREE.Scene,
    ) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.plane = plane;
        this.unitCreator = new UnitCreator(this.camera, [plane], this.scene);
        this.currentController = this.unitCreator;
        this.controlSwitch = this.controlSwitch.bind(this);
        document.addEventListener("keydown", this.hotKeyControlSwitch);
        this.currentController$.next("unitCreator");
    }

    private hotKeyControlSwitch(event: any): void {
        switch (event.keyCode) {
            case 49:
                this.currentController.dispose();
                this.currentController = new Orbit(this.camera, this.renderer);
                this.currentController$.next("orbit");
                break;
            case 50:
                this.currentController.dispose();
                this.currentController = this.unitCreator;
                this.unitCreator.activate();
                this.currentController$.next("unitCreator");
                break;
            case 51:
                this.currentController.dispose();
                this.currentController = new DragAndDrop(
                    this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
                    this.unitCreator.objects.filter((obj) => obj.name === "plane"),
                    this.camera,
                    this.scene,
                );
                this.currentController$.next("dragAndDrop");
                break;
            default:
                break;
        }
    }

    public controlSwitch(type: number): void {
        switch (type) {
            case 1:
                this.currentController.dispose();
                this.currentController = new Orbit(this.camera, this.renderer);
                this.currentController$.next("orbit");
                break;
            case 2:
                this.currentController.dispose();
                this.currentController = this.unitCreator;
                this.unitCreator.activate();
                this.currentController$.next("unitCreator");
                break;
            case 3:
                this.currentController.dispose();
                this.currentController = new DragAndDrop(
                    this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
                    this.unitCreator.objects.filter((obj) => obj.name === "plane"),
                    this.camera,
                    this.scene,
                );
                this.currentController$.next("dragAndDrop");
                break;
            default:
                break;
        }
    }
}
