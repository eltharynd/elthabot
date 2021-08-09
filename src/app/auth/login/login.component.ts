import { Component } from '@angular/core';
import { DataService } from 'src/app/shared/data.service'

import * as uuid from 'uuid'
import { AuthGuard } from '../auth.guard'

const SCOPES = [
  'bits:read',
  'channel:edit:commercial',
  'channel:manage:broadcast',
  'channel:manage:polls',
  'channel:manage:predictions',
  'channel:manage:redemptions',
  'channel:manage:schedule',
  'channel:read:hype_train',
  'channel:read:polls',
  'channel:read:predictions',
  'channel:read:redemptions',
  'channel:read:subscriptions',
  'clips:edit',
  'moderation:read',
  'user:edit',
  'user:manage:blocked_users',
  'user:read:blocked_users',
  'user:read:broadcast',
  'user:read:follows',
  'user:read:subscriptions',
  'channel:moderate',
  'chat:edit',
  'chat:read',
  'whispers:read',
  'whispers:edit'
]
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  message: string

  constructor(private data: DataService, public auth: AuthGuard) {
  }

  async loginWithTwitch() {

    let state = uuid.v4()

    let listener = this.data.socketIO.on(state, (data) => {
      if(data.token) {
        this.auth.login(data)
      } else {
        this.message = 'Could not authenticate'
      }
      listener.close()
    })

    let width = 600, height = 800

    let top = window.screen.height - height;
    top = top > 0 ? top/2 : 0;    
    let left = window.screen.width - width;
    left = left > 0 ? left/2 : 0;

    //@ts-ignore
    window.open(`https://id.twitch.tv/oauth2/authorize
    ?client_id=${DataService.clientId}
    &redirect_uri=${window.location.origin}/auth/token
    &response_type=code
    &force_verify=true
    &state=${state}
    &scope=${SCOPES.join('+')}`
    .replace(/\s/g, '') , '_blank', `width=${width},height=${height},top=${top},left=${left},resizeable=false`)

    this.message = 'Login via the newly opened twitch window...'
  }
}
