import { NgModule } from "@angular/core"
import { SharedMaterialModule } from "../sharedmaterial.module"
import { AuthRoutingModule } from "./auth-routing.module"
import { AuthComponent } from "./auth.component";
import { LoginComponent } from './login/login.component';
import { TokenComponent } from './token/token.component'



 @NgModule({
  imports: [
    AuthRoutingModule,
    SharedMaterialModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    TokenComponent
  ],

 })
 export class AuthModule {}