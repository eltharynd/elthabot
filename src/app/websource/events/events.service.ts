import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Subject } from 'rxjs'
import { AuthGuard } from 'src/app/auth/auth.guard'
import { _element } from 'src/app/dashboard/twitch/api/api.component'
import { DataService, SERVER_URL } from 'src/app/shared/data.service'

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  elements: _element[] = []
  private eventsQueue: any[] = []
  eventsSubject: Subject<any> = new Subject()


  constructor(private data: DataService) { 

/*     setTimeout(() => {
      this.queueUp({
        type: 'tts',
        voice: 'au',
        text: `What do you think this tts would do???? huh?`
      })
    }, 1000); */
    this.eventsSubject.subscribe(event => {
      switch (event.what) {
        case 'ended':
          setTimeout(() => {
            this.playing = false
            this.playNext()
          }, 500);
      }
    }) 

    this.data.userId.subscribe(async user => {
      this.elements = await this.data.get(`elements/${user}`)
    })


/*     let exampleRedemption = {
      eventType: 'redeem',
      broadcaster_user_id: "76541564",
      broadcaster_user_login: "eltharynd",
      broadcaster_user_name: "eltharynd",
      id: "8464cdcd-4952-4ccc-bb4f-dd9ebe103375",
      user_id: "76541564",
      user_login: "eltharynd",
      user_name: "eltharynd",
      user_input: "",
      status: "unfulfilled",
      redeemed_at: "2022-04-24T18:19:32.939324522Z",
      reward: {
          "id": "3377e7b8-900f-4f7d-808a-01d60d6a3b05",
          "title": "Hydrate!",
          "prompt": "Sponsored by lttstore.com",
          "cost": 1000
      }
    } */
    this.data.socketIO.on('events', data => {
      console.log('event received', data)
      for(let element of this.elements) {

        let ignore = false
        for(let c of element.conditions) {
          console.log(c)
          if(c.type === 'bit') {
            if(data.eventType !== 'cheer') {
              ignore = true
              continue
            }
          } else if(c.type === 'user') {
            //TODO implement
            continue
          } else if(c.type === 'redeem') {
            //TODO implement
            if(data.eventType !== 'redeem') {
              ignore = true
              continue
            }
            ignore = c.compared.id !== data.reward.id
          }
        }

        if(ignore) continue

        for(let event of element.events) {
          if(event.type==='tts') {
            switch (event.message) {
              case 'subMessage':
                event.text = null
                break
              case 'cheerMessage':
                event.text = null
                break
              case 'redemptionMessage':
              default:
                event.text = data.user_input
                break
            }
          }
          this.queueUp(event)
        }

      }
    })
    this.data.socketIO.on('test', data => {
      this.queueUp(data)
    })
  }



  queueUp(event) {
    this.eventsQueue.push(event)
    this.playNext()
  } 
  
  private playing = false
  private playNext() {
    if(this.playing || this.eventsQueue.length<=0)
      return
    this.playing = true
    let buffer = this.eventsQueue.splice(0, 1)[0]
    this.eventsSubject.next(Object.assign(buffer, { what: 'start' }))
  } 
}

export enum POSITION {
  TOP_LEFT = 'TOP_LEFT',
  TOP = 'TOP',
  TOP_RIGHT = 'TOP_RIGHT',
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM = 'BOTTOM',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT'
}

export enum EVENT_TYPES {
  video = 'Video',
  audio = 'Audio',
  tts = 'TTS',
/*   gif = 'GIF',
  message = 'Chat Message' */
}