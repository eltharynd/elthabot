
import { NgModule } from "@angular/core"
import { CommonModule } from "../../common/common.module"
import { SharedMaterialModule } from "../../shared/material.module"
import { SharedNebularModule } from "../../shared/nebular.module"

import { DiscordRoutingModule } from "./discord-routing.module"
import { DiscordComponent } from "./discord.component"
import { ApiComponent } from "./api/api.component"
import { FunctionsComponent } from "./functions/functions.component"



 @NgModule({
  imports: [
    DiscordRoutingModule,
    SharedMaterialModule,
    SharedNebularModule,
    CommonModule,
  ],
  declarations: [
    DiscordComponent,
    FunctionsComponent,
    ApiComponent,
  ],
 })
 export class DiscordModule { }