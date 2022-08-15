import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { ControllerService } from "../controller/controller.service";
// import { MatButtonModule } from "@angular/material/button";
@Component({
    selector: "app-side-panel",
    templateUrl: "./side-panel.component.html",
    styleUrls: ["./side-panel.component.scss"],
})
export class SidePanelComponent implements OnInit {
    currentCotroller: string = "unitCreator";

    widthFormControl = new FormControl("");

    width$: Subject<number> = new Subject();

    depth$: Subject<number> = new Subject();

    height$: Subject<number> = new Subject();

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

    public setWidth(event: Event): void {
        console.log(event);
    }
}
