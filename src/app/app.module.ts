import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { SidePanelComponent } from "./components/side-panel/side-panel.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
// import { InteractionComponent } from "./components/interaction/interaction.component";

@NgModule({
    declarations: [AppComponent, CanvasComponent, SidePanelComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatButtonToggleModule,
        BrowserAnimationsModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
