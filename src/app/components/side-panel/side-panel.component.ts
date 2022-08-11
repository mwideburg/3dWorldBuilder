import { Component, OnInit } from "@angular/core";
import { ControllerService } from "../controller/controller.service";
// import { MatButtonModule } from "@angular/material/button";
@Component({
    selector: "app-side-panel",
    templateUrl: "./side-panel.component.html",
    styleUrls: ["./side-panel.component.scss"],
})
export class SidePanelComponent implements OnInit {
    currentCotroller: string = "unitCreator";

    constructor(private controllerService: ControllerService) {
        this.controllerService.currentController$.subscribe((controller) => {
            this.currentCotroller = controller;
        });
    }

    ngOnInit(): void {
        console.log("START");
    }

    public controlSwitch(type: number): void {
        this.controllerService.controlSwitch(type);
    }
}
