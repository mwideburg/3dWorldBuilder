import { Component, Inject, OnInit } from "@angular/core";
import { ControllerService } from "../controller/controller.service";
@Component({
    selector: "app-side-panel",
    templateUrl: "./side-panel.component.html",
    styleUrls: ["./side-panel.component.scss"],
})
export class SidePanelComponent implements OnInit {
    currentController: string = "unitCreator";

    controllerService: ControllerService;

    constructor(@Inject(ControllerService) controllerService: ControllerService) {
        this.controllerService = controllerService;
        this.controllerService.currentController$.subscribe((controller) => {
            this.currentController = controller;
            console.log(controller);
        });
        console.log(this.controllerService);
    }

    ngOnInit(): void {
        console.log("START");
    }
}
