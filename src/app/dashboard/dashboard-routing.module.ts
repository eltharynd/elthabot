import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { DashboardComponent } from "./dashboard.component"
import { DashboardModule } from "./dashboard.module"
import { MainComponent } from "./main/main.component"
import { TwitchComponent } from "./twitch/twitch.component"


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'twitch',
        loadChildren: () => import('./twitch/twitch.module').then(
          m => m.TwitchModule
        ),
      },
      {
        path: 'discord',
        loadChildren: () => import('./discord/discord.module').then(
          m => m.DiscordModule
        ),
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}