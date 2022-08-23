import { Injectable } from "@angular/core";
import * as THREE from "three";
import { UnitCreator } from "../interaction/unitCreator";
import { Orbit } from "../interaction/orbit";
import { DragAndDrop } from "../interaction/dragAndDrop";
import { Subject } from "rxjs";
import { Dimension } from "../types/dimensionType";
import { Cube } from "../units/cube";

@Injectable({
    providedIn: "root",
})
export class ControllerService {
    scene!: THREE.Scene;

    camera!: THREE.PerspectiveCamera;

    renderer!: THREE.WebGLRenderer;

    plane!: THREE.Object3D;

    currentController!: Orbit | UnitCreator | DragAndDrop;

    unitCreator!: UnitCreator;

    dragAndDrop!: DragAndDrop;

    currentController$: Subject<string> = new Subject();

    selectedUnitData$: Subject<{ name: string; attributes: string[]; unit: THREE.Object3D }> =
        new Subject();

    public createController(
        camera: THREE.PerspectiveCamera,
        plane: THREE.Object3D,
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
    ): void {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.plane = plane;
        this.unitCreator = new UnitCreator(this.camera, [plane], this.scene);
        this.currentController = this.unitCreator;

        this.dragAndDrop = new DragAndDrop(
            this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
            this.unitCreator.objects.filter((obj) => obj.name === "plane"),
            this.camera,
            this.scene,

            // this.renderer,
        );
        this.controlSwitch = this.controlSwitch.bind(this);
        this.hotKeyControlSwitch = this.hotKeyControlSwitch.bind(this);
        document.addEventListener("keydown", this.hotKeyControlSwitch);
        this.currentController$.next("unitCreator");
        this.dragAndDrop.combinedUnits$.subscribe(
            (units: { add: Cube; remove: THREE.Object3D[] }) => {
                this.unitCreator.objects.push(units.add.mesh);
                this.scene.add(units.add.group);
                this.unitCreator.removeObjects(units.remove);
                units.remove.forEach((obj) => this.scene.remove(obj));
            },
        );
    }

    public setDimensions(dimensions: Dimension): void {
        // console.log(dimensions);
        this.unitCreator.setDimensions(dimensions);
    }

    public setName(name: string): void {
        if (this.currentController instanceof Orbit && this.currentController.selectedObject) {
            this.currentController.setName(name);
        }
    }

    public changeLevel(level: number): void {
        if (this.currentController instanceof Orbit && this.currentController.selectedObject) {
            this.currentController.changeLevel(level);
        }
    }

    public changeGroupLevel(level: number): void {
        if (
            this.currentController instanceof DragAndDrop &&
            this.currentController.group.children.length > 0
        ) {
            // console.log(level);
            this.currentController.changeLevel(level);
        }
    }

    public swapOrientation(): void {
        if (this.currentController instanceof UnitCreator) {
            this.currentController.swapOrientation();
        }
    }

    public combineUnits(): void {
        if (this.currentController instanceof DragAndDrop) {
            this.currentController.combineUnitsIntoOne();
            // this.unitCreator.objects = units;
        }
    }

    public copyGroupOfUnits(): void {
        if (this.currentController instanceof DragAndDrop) {
            this.currentController.copyGroupOfUnits();
            // this.unitCreator.objects = units;
        }
    }

    public deselectAll(): void {
        if (this.currentController instanceof DragAndDrop) {
            this.currentController.deselectAll();
            // this.unitCreator.objects = units;
        }
    }

    private hotKeyControlSwitch(event: any): void {
        // console.log(event.keyCode);

        switch (event.keyCode) {
            case 79:
                if (this.currentController instanceof Orbit) {
                    return;
                }

                if (this.currentController instanceof DragAndDrop) {
                    this.currentController.disposeTemp();
                } else {
                    this.currentController.dispose();
                }

                this.currentController = new Orbit(
                    this.camera,
                    this.renderer,
                    this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
                );
                this.currentController.selectedObject$.subscribe((data: THREE.Object3D) => {
                    if (data.name) {
                        // console.log("CONTROLLER", data.name);
                        this.selectedUnitData$.next({
                            name: data.name,
                            attributes: [],
                            unit: data,
                        });
                    }
                });
                this.currentController$.next("orbit");
                break;
            case 85:
                this.currentController.dispose();
                this.currentController = this.unitCreator;
                this.unitCreator.activate();
                this.currentController$.next("unitCreator");

                break;
            case 71:
                this.currentController.dispose();

                this.currentController = this.dragAndDrop;
                this.dragAndDrop.activate(
                    this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
                    this.unitCreator.objects.filter((obj) => obj.name === "plane"),
                );
                this.dragAndDrop.addObject$.subscribe((object: THREE.Object3D) => {
                    this.unitCreator.objects.push(object);
                });
                this.currentController$.next("dragAndDrop");
                break;
            default:
                break;
        }
    }

    public controlSwitch(type: number): void {
        switch (type) {
            case 1:
                if (this.currentController instanceof DragAndDrop) {
                    this.currentController.disposeTemp();
                } else {
                    this.currentController.dispose();
                }

                this.currentController = new Orbit(
                    this.camera,
                    this.renderer,
                    this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
                );
                this.currentController.selectedObject$.subscribe((data: THREE.Object3D) => {
                    if (data.name) {
                        // console.log("CONTROLLER", data.name);
                        this.selectedUnitData$.next({
                            name: data.name,
                            attributes: [],
                            unit: data,
                        });
                    }
                });
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

                this.currentController = this.dragAndDrop;
                this.dragAndDrop.activate(
                    this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
                    this.unitCreator.objects.filter((obj) => obj.name === "plane"),
                );
                this.dragAndDrop.addObject$.subscribe((object: THREE.Object3D) => {
                    this.unitCreator.objects.push(object);
                });
                this.currentController$.next("dragAndDrop");
                break;
            default:
                break;
        }
    }
}
