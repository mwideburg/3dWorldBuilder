import * as THREE from "three";

import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper";

export class BoxSelector {
    selectionBox: SelectionBox;

    helper!: any;

    renderer: THREE.WebGLRenderer;

    disabled: boolean = true;

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
        this.disabled = true;
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
        console.log(this.disabled);

        if (!this.disabled) {
            console.log("DISABLED");
            return;
        }

        this.selectionBox.collection.forEach((obj: any) => {
            if (obj.name === "cube" && obj.material.emissive) {
                obj.material.emissive.set(0xffffff);
            }
        });

        this.selectionBox.startPoint.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5,
        );
    }

    public pointerUp(event: MouseEvent): void {
        if (!this.disabled) {
            return;
        }

        this.selectionBox.endPoint.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5,
        );

        const allSelected = this.selectionBox.select();

        allSelected.forEach((obj: any) => {
            if (obj.name === "cube" && obj.material.emissive) {
                obj.material.emissive.set(0xffffff);
            }
        });
    }

    public pointerMove(event: MouseEvent): void {
        if (this.helper.isDown) {
            console.log(this.selectionBox.collection);
            this.selectionBox.collection.forEach((obj: any) => {
                if (obj.name === "cube") {
                    obj.material.color.set(0x000000);
                }
            });

            this.selectionBox.endPoint.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1,
                0.5,
            );

            const allSelected = this.selectionBox.select();
            allSelected.forEach((obj: any) => {
                if (obj.name === "cube" && obj.material.emissive) {
                    obj.material.emissive.set(0xffffff);
                }
            });
        }
    }
}
