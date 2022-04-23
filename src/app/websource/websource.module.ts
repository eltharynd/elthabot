import { NgModule } from "@angular/core"
import { SharedMaterialModule } from "../shared/material.module"
import { CheersComponent } from "./cheers/cheers.component"
import { HypetrainModule } from "./hypetrain/hypetrain.module"
import { PredictionsComponent } from "./predictions/predictions.component"
import { WebSourceRoutingModule } from "./websource-routing.module"
import { WebSourceComponent } from "./websource.component";
import { ClipComponent } from './common/clip/clip.component';
import { EventsComponent } from './events/events.component';
import { VideoComponent } from './events/video/video.component'




 @NgModule({
  imports: [
    WebSourceRoutingModule,
    SharedMaterialModule,
    HypetrainModule,
  ],
  declarations: [
    WebSourceComponent,
    PredictionsComponent,
    CheersComponent,
    ClipComponent,
    EventsComponent,
    VideoComponent,
  ],
 })
 export class WebSourceModule {}