import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { SidePanelComponent } from "./components/side-panel/side-panel.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// import { InteractionComponent } from "./components/interaction/interaction.component";

@NgModule({
    declarations: [AppComponent, CanvasComponent, SidePanelComponent],
    imports: [BrowserModule, AppRoutingModule, MatButtonToggleModule, BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
