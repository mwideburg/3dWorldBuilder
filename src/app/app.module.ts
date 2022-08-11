import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CanvasComponent } from "./components/canvas/canvas.component";
import { SidePanelComponent } from "./components/side-panel/side-panel.component";
// import { InteractionComponent } from "./components/interaction/interaction.component";

@NgModule({
    declarations: [AppComponent, CanvasComponent, SidePanelComponent],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
