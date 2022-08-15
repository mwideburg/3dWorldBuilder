import { Component, OnInit } from "@angular/core";

import { ControllerService } from "../controller/controller.service";
import { FormBuilder } from "@angular/forms";
// import { MatButtonModule } from "@angular/material/button";
@Component({
    selector: "app-side-panel",
    templateUrl: "./side-panel.component.html",
    styleUrls: ["./side-panel.component.scss"],
})
export class SidePanelComponent implements OnInit {
    currentCotroller: string = "unitCreator";

    dimensions = this.formBuilder.group({
        width: "5",
        depth: "5",
        height: "10",
    });

    unitAttributes = this.formBuilder.group({
        name: "",
    });

    unitName: string = "";

    unitIsSelected: boolean = false;

    constructor(public controllerService: ControllerService, private formBuilder: FormBuilder) {
        this.controllerService.currentController$.subscribe((controller) => {
            this.currentCotroller = controller;

            if (controller !== "orbit") {
                this.unitIsSelected = false;
            }
        });
        this.controllerService.selectedUnitData$.subscribe(
            (data: { name: string; attributes: string[] }) => {
                // this.unitIsSelected = false;
                this.unitIsSelected = true;

                if (data.name) {
                    this.unitAttributes.value.name = data.name;
                    this.unitName = data.name;
                } else {
                    this.unitName = "";
                    this.unitIsSelected = false;
                }
            },
        );
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

    public onSubmit(e: Event): void {
        e.preventDefault();
        // Process checkout data here
        const dimensions = {
            width: Number(this.dimensions.value.width) * 10,
            depth: Number(this.dimensions.value.depth) * 10,
            height: Number(this.dimensions.value.height) * 10,
        };
        console.log("Dimensions changing", dimensions);
        this.controllerService.setDimensions(dimensions);
        // this.dimensions.reset();
    }

    public onUnitSubmit(e: Event): void {
        e.preventDefault();
        // Process checkout data here
        this.unitIsSelected = false;
        console.log("Naming unit", this.unitAttributes);
        this.controllerService.setName(this.unitAttributes.value.name);
        this.unitName = this.unitAttributes.value.name;
        this.unitAttributes.reset();
    }
}
