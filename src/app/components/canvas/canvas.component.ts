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
        console.log(this.threeManager);
    }

    ngAfterViewInit(): void {
        console.log("START");
        this.threeManager.renderEngine.render();
    }
}
