import * as THREE from "three";
import { Subject } from "rxjs";
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper";

export class BoxSelector {
    selectionBox: SelectionBox;

    helper!: any;

    renderer: THREE.WebGLRenderer;

    attachObjectToSelectedGroup$: Subject<THREE.Object3D> = new Subject();

    attachObjectToScene$: Subject<THREE.Object3D> = new Subject();

    constructor(
        camera: THREE.PerspectiveCamera,
        scene: THREE.Scene,
        renderer: THREE.WebGLRenderer,
    ) {
        this.selectionBox = new SelectionBox(camera, scene);
        this.renderer = renderer;
        // this.helper = new SelectionHelper(this.renderer, "selectBox");

        this.pointerDown = this.pointerDown.bind(this);
        this.pointerMove = this.pointerMove.bind(this);
        this.pointerUp = this.pointerUp.bind(this);

        console.log("CREATED BOX SELECTOR");
    }

    public disable(): void {
        console.log("DISABLE BOX SELECTOR", this.renderer);
        this.helper.dispose();
        document.removeEventListener("pointerdown", this.pointerDown);
        document.removeEventListener("pointermove", this.pointerMove);
        document.removeEventListener("pointerup", this.pointerUp);
    }

    public activate(): void {
        this.helper = new SelectionHelper(this.renderer, "selectBox");

        document.addEventListener("pointerdown", this.pointerDown);
        document.addEventListener("pointermove", this.pointerMove);
        document.addEventListener("pointerup", this.pointerUp);
    }

    public pointerDown(event: MouseEvent): void {
        console.log("POINTER DOWN SELECTION BOX");

        // this.selectionBox.collection.forEach((obj: any) => {
        //     if (obj.name === "cube") {
        //         obj.material.color.set(0x000000);
        //     }
        // });

        this.selectionBox.startPoint.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5,
        );
    }

    public pointerUp(event: MouseEvent): void {
        this.selectionBox.endPoint.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5,
        );

        // const allSelected = this.selectionBox.select();

        // allSelected.forEach((obj: any) => {
        //     if (obj.name === "cube") {
        //         obj.material.color.set(0x000000);
        //     }
        // });
    }

    public pointerMove(event: MouseEvent): void {
        if (this.helper.isDown) {
            this.selectionBox.collection.forEach((obj: any) => {
                if (obj.name === "cube") {
                    console.log("CUBE OBJECT", obj);
                    this.attachObjectToScene$.next(obj.parent);
                }
            });

            this.selectionBox.endPoint.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1,
                0.5,
            );

            const allSelected = this.selectionBox.select();
            console.log("POINTER MOVE SELECTED CUBE", allSelected);
            allSelected.forEach((obj: any) => {
                if (obj.name === "cube") {
                    this.attachObjectToSelectedGroup$.next(obj.parent);
                }
            });
        }
    }
}