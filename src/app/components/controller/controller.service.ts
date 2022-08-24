import { Injectable } from "@angular/core";
import * as THREE from "three";
import { UnitCreator } from "../interaction/unitCreator";
// import { Orbit } from "../interaction/orbit";
import { DragAndDrop } from "../interaction/dragAndDrop";
import { Subject } from "rxjs";
import { Dimension } from "../types/dimensionType";
import { InteractionService } from "../interaction/interactionService";
import { ObjectManager } from "../objectService/objectManager";
import { Selector } from "../interaction/selector";
// import { Cube } from "../units/cube";

@Injectable({
    providedIn: "root",
})
export class ControllerService {
    camera!: THREE.PerspectiveCamera;

    renderer!: THREE.WebGLRenderer;

    unitCreator!: UnitCreator;

    selector!: Selector;

    dragAndDrop!: DragAndDrop;

    currentController$: Subject<string> = new Subject();

    currentController: string = "unitCreator";

    selectedUnitData$: Subject<{ name: string; attributes: string[]; unit: THREE.Object3D }> =
        new Subject();

    requestAnimation$: Subject<boolean> = new Subject();

    combineUnits$: Subject<boolean> = new Subject();

    constructor(
        public interactionService: InteractionService,
        private objectManager: ObjectManager,
    ) {}

    public createController(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
        this.renderer = renderer;
        this.camera = camera;
        // this.objects = objects;
        this.unitCreator = new UnitCreator(this.camera);
        console.log(this.objectManager);
        this.selector = new Selector(this.camera);
        // this.dragAndDrop = new DragAndDrop(
        //     this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
        //     this.unitCreator.objects.filter((obj) => obj.name === "plane"),
        //     this.camera,
        //     this.scene,

        //     // this.renderer,
        // );
        this.currentController$.next("unitCreator");

        this.currentController$.subscribe((type: string) => {
            this.currentController = type;
        });
        this.interactionService.createInteractions(this.renderer.domElement, this.camera);
        this.interactionService.click$.subscribe((isShiftDown: boolean) => {
            console.log(isShiftDown);

            switch (this.currentController) {
                case "selector":
                    this.selector.onPointerDown(
                        this.interactionService.raycaster,
                        this.objectManager.objects,
                        false,
                        isShiftDown,
                    );
                    break;
                case "unitCreator":
                    this.unitCreator.click(
                        this.interactionService.raycaster,
                        isShiftDown,
                        this.objectManager.objects,
                    );
                    break;

                default:
                    break;
            }

            this.requestAnimation$.next(true);
        });
        this.interactionService.pointerMove$.subscribe(() => {
            switch (this.currentController) {
                case "selector":
                    this.selector.onPointerMove(
                        this.interactionService.raycaster,
                        this.objectManager.objects.filter((obj) => obj.name !== "plane"),
                        false,
                        false,
                    );
                    break;
                case "unitCreator":
                    this.unitCreator.onPointerMove(
                        this.interactionService.raycaster,
                        this.objectManager.objects,
                    );

                    break;

                default:
                    break;
            }

            this.requestAnimation$.next(true);
        });

        this.interactionService.dblClicked$.subscribe(() => {
            console.log("DOUBLE CLICKED");

            if (this.currentController === "selector") {
                this.selector.removeObjectFromGroup(
                    this.interactionService.raycaster,
                    this.objectManager.objects,
                );
            }
        });

        // this.controlSwitch = this.controlSwitch.bind(this);
        // this.hotKeyControlSwitch = this.hotKeyControlSwitch.bind(this);
        // document.addEventListener("keydown", this.hotKeyControlSwitch);
        // this.currentController$.next("unitCreator");
        // this.dragAndDrop.combinedUnits$.subscribe(
        //     (units: { add: Cube; remove: THREE.Object3D[] }) => {
        //         this.unitCreator.objects.push(units.add.mesh);
        //         this.scene.add(units.add.group);
        //         this.unitCreator.removeObjects(units.remove);
        //         units.remove.forEach((obj) => this.scene.remove(obj));
        //     },
        // );
    }

    public setDimensions(dimensions: Dimension): void {
        // console.log(dimensions);
        this.unitCreator.setDimensions(dimensions);
    }

    // public setName(name: string): void {
    //     if (this.currentController instanceof Orbit && this.currentController.selectedObject) {
    //         this.currentController.setName(name);
    //     }
    // }

    // public changeLevel(level: number): void {
    //     if (this.currentController instanceof Orbit && this.currentController.selectedObject) {
    //         this.currentController.changeLevel(level);
    //     }
    // }

    public changeGroupLevel(level: number): void {
        // console.log(level);
        this.dragAndDrop.changeLevel(level);
    }

    public swapOrientation(): void {
        this.unitCreator.swapOrientation();
    }

    public combineUnits(): void {
        this.combineUnits$.next(true);
        // this.selector.combineUnitsIntoOne();
        // this.unitCreator.objects = units;
    }

    public copyGroupOfUnits(): void {
        this.dragAndDrop.copyGroupOfUnits();
        // this.unitCreator.objects = units;
    }

    public deselectAll(): void {
        this.dragAndDrop.deselectAll();
        // this.unitCreator.objects = units;
    }

    // private hotKeyControlSwitch(event: any): void {
    //     console.log(event.keyCode);

    //     switch (event.keyCode) {
    //         case 79:
    //             if (this.currentController instanceof Orbit) {
    //                 return;
    //             }

    //             if (this.currentController instanceof DragAndDrop) {
    //                 this.currentController.disposeTemp();
    //             } else {
    //                 this.currentController.dispose();
    //             }

    //             this.currentController = new Orbit(
    //                 this.camera,
    //                 this.renderer,
    //                 this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
    //             );
    //             this.currentController.selectedObject$.subscribe((data: THREE.Object3D) => {
    //                 if (data.name) {
    //                     // console.log("CONTROLLER", data.name);
    //                     this.selectedUnitData$.next({
    //                         name: data.name,
    //                         attributes: [],
    //                         unit: data,
    //                     });
    //                 }
    //             });
    //             this.currentController$.next("orbit");
    //             break;
    //         case 85:
    //             this.currentController.dispose();
    //             this.currentController = this.unitCreator;
    //             this.unitCreator.activate();
    //             this.currentController$.next("unitCreator");
    //             break;
    //         case 71:
    //             this.currentController.dispose();
    //             this.currentController = this.dragAndDrop;
    //             this.dragAndDrop.activate(
    //                 this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
    //                 this.unitCreator.objects.filter((obj) => obj.name === "plane"),
    //             );
    //             this.dragAndDrop.addObject$.subscribe((object: THREE.Object3D) => {
    //                 this.unitCreator.objects.push(object);
    //             });
    //             this.currentController$.next("dragAndDrop");
    //             break;
    //         default:
    //             break;
    //     }
    // }

    public controlSwitch(type: number): void {
        switch (type) {
            case 1:
                this.currentController$.next("selector");
                this.unitCreator.disable();
                // this.selector.activate();
                break;

            case 2:
                this.currentController$.next("unitCreator");
                this.selector.disable();
                // this.unitCreator.activate();
                break;

            default:
                break;
        }
        // switch (type) {
        //     case 1:
        //         if (this.currentController instanceof DragAndDrop) {
        //             this.currentController.disposeTemp();
        //         } else {
        //             this.currentController.dispose();
        //         }
        //         this.currentController = new Orbit(
        //             this.camera,
        //             this.renderer,
        //             this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
        //         );
        //         this.currentController.selectedObject$.subscribe((data: THREE.Object3D) => {
        //             if (data.name) {
        //                 // console.log("CONTROLLER", data.name);
        //                 this.selectedUnitData$.next({
        //                     name: data.name,
        //                     attributes: [],
        //                     unit: data,
        //                 });
        //             }
        //         });
        //         this.currentController$.next("orbit");
        //         break;
        //     case 2:
        //         this.currentController.dispose();
        //         this.currentController = this.unitCreator;
        //         this.unitCreator.activate();
        //         this.currentController$.next("unitCreator");
        //         break;
        //     case 3:
        //         this.currentController.dispose();
        //         this.currentController = this.dragAndDrop;
        //         this.dragAndDrop.activate(
        //             this.unitCreator.objects.filter((obj) => obj.name !== "plane"),
        //             this.unitCreator.objects.filter((obj) => obj.name === "plane"),
        //         );
        //         this.dragAndDrop.addObject$.subscribe((object: THREE.Object3D) => {
        //             this.unitCreator.objects.push(object);
        //         });
        //         this.currentController$.next("dragAndDrop");
        //         break;
        //     default:
        //         break;
        // }
    }
}
