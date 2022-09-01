import { Injectable } from "@angular/core";
import * as THREE from "three";
import { UnitCreator } from "../interaction/unitCreator";
// import { Orbit } from "../interaction/orbit";
import { DragAndDrop } from "../interaction/old/dragAndDrop";
import { Subject } from "rxjs";
import { Dimension } from "../types/dimensionType";
import { InteractionService } from "../interaction/interactionService";
import { ObjectManager } from "../objectService/objectManager";
import { Selector } from "../interaction/selector";
import { BoxSelector } from "../interaction/boxSelector";
// import { Cube } from "../units/cube";

@Injectable({
    providedIn: "root",
})
export class ControllerService {
    camera!: THREE.PerspectiveCamera;

    renderer!: THREE.WebGLRenderer;

    unitCreator!: UnitCreator;

    selector!: Selector;

    boxSelector!: BoxSelector;

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
    ) {
        this.enableBoxSelector = this.enableBoxSelector.bind(this);
        this.disableBoxSelector = this.disableBoxSelector.bind(this);
        document.addEventListener("keydown", this.enableBoxSelector);
        document.addEventListener("keyup", this.disableBoxSelector);
    }

    public createController(
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
    ): void {
        this.renderer = renderer;
        this.camera = camera;

        this.unitCreator = new UnitCreator(this.camera);

        this.selector = new Selector(this.camera);
        this.boxSelector = new BoxSelector(this.camera, scene, this.renderer);

        this.currentController$.next("unitCreator");

        this.currentController$.subscribe((type: string) => {
            this.currentController = type;
        });
        this.interactionService.createInteractions(this.renderer.domElement, this.camera);
        this.interactionService.click$.subscribe((isShiftDown: boolean) => {
            // console.log(isShiftDown);

            switch (this.currentController) {
                case "selector":
                    this.selector.onPointerDown(
                        this.interactionService.raycaster,
                        this.objectManager.objects,
                        this.objectManager.isCopying,
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

        this.interactionService.pointerIsDown$.subscribe(() => {
            this.selector.onPointerDown(
                this.interactionService.raycaster,
                this.objectManager.objects,
                this.objectManager.isCopying,
                false,
            );
        });
        this.interactionService.pointerMove$.subscribe(() => {
            switch (this.currentController) {
                case "selector":
                    // console.log("SELECTER OBJECT", this.objectManager.objects);
                    // console.log(this.interactionService.pointerIsDown);

                    if (
                        this.interactionService.commandIsDown &&
                        this.interactionService.pointerIsDown
                    ) {
                        this.selector.moveObjects(
                            this.interactionService.raycaster,
                            this.objectManager.objects.filter((obj) => obj.name === "plane"),
                            this.objectManager.selectedGroup.children,
                        );
                    }

                    if (this.objectManager.isCopying) {
                        // console.log(this.objectManager.isCopying);
                        this.selector.onPointerMove(
                            this.interactionService.raycaster,
                            this.objectManager.objects.filter((obj) => obj.name === "plane"),
                            true,
                            this.objectManager.rollOverGroup,
                        );
                    }

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
            // console.log("DOUBLE CLICKED");

            if (this.currentController === "selector") {
                // this.selector.removeObjectFromGroup(
                //     this.interactionService.raycaster,
                //     this.objectManager.objects,
                // );
            }
        });
    }

    public setDimensions(dimensions: Dimension): void {
        // console.log(dimensions);
        this.unitCreator.setDimensions(dimensions);
    }

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

    public controlSwitch(type: number): void {
        switch (type) {
            case 1:
                this.interactionService.activate();
                this.currentController$.next("selector");
                this.unitCreator.disable();
                this.boxSelector.disable();
                // this.selector.activate();
                break;

            case 2:
                this.interactionService.activate();
                this.currentController$.next("unitCreator");
                this.selector.disable();
                this.boxSelector.disable();
                // this.unitCreator.activate();
                break;

            case 3:
                this.currentController$.next("boxSelector");
                this.interactionService.diasbleEventKeys();
                this.interactionService.disable();
                this.unitCreator.disable();
                this.selector.disable();
                this.boxSelector.activate();
                break;
            default:
                break;
        }
    }

    private enableBoxSelector(e: KeyboardEvent): void {
        // console.log(this.currentController);

        if (e.key === "b" && this.currentController === "selector") {
            this.interactionService.diasbleEventKeys();
            this.interactionService.disable();
            this.selector.disable();
            this.boxSelector.activate();
            this.currentController = "boxSelector";
            this.boxSelector.keyIsDown = true;
        }
    }

    private disableBoxSelector(e: KeyboardEvent): void {
        // console.log(e);

        if (e.key === "b") {
            this.interactionService.activate();
            // console.log(this.boxSelector);
            this.currentController$.next("selector");
            this.unitCreator.disable();
            this.boxSelector.keyIsDown = false;

            if (!this.boxSelector.pointerIsDown) {
                this.boxSelector.disable();
            }
        }
    }
}
