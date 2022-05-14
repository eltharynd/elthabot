import { Injectable } from '@angular/core'
import { filter, from, Subject, take } from 'rxjs'
import { AuthGuard } from '../auth/auth.guard'
import { DataService } from './data.service'
import { SettingsService } from './settings.service'

@Injectable({
  providedIn: 'root',
})
export class HypetrainService {
  currentLevel: number = 0
  ending: boolean = false
  expiresAt: Date = null
  progress: number = 0

  onLevelChange: Subject<number> = new Subject()
  onProgress: Subject<number> = new Subject()

  carriages = []

  private eventsQueue = []
  private eventsSubject: Subject<any> = new Subject()

  channelPic = 'https://static-cdn.jtvnw.net/jtv_user_pictures/1148a899-e070-4a33-8d06-9cb84b9d2a38-profile_image-300x300.png'

  constructor(private data: DataService, private auth: AuthGuard, public settings: SettingsService) {
    if (!this.data._userId) this.data.userId.subscribe((userId) => this.fetchUser())
    else this.fetchUser()

    this.data.socketIO.on('hypetrain', (data) => this.queueUp(data))

    this.eventsSubject.subscribe(async (data) => {
      if (data.processed) {
        this.processed--
        this.processNext()
        return
      }
      console.log('processing')

      this.ending = data.type === 'Hype Train End' || (data.event.level === 5 && +data.event.progress >= +data.event.goal)

      this.expiresAt = data.event.expires_at ? new Date(data.event.expires_at) : null
      this.progress = data.event.progress ? Math.floor((data.event.progress / data.event.goal) * 100) : 0

      if (data.type === 'Hype Train Begin') {
        this.expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        this.currentLevel = 1
        this.onLevelChange.next(this.currentLevel)
      }

      if (data.event?.level !== this.currentLevel) {
        this.currentLevel = data.event.level
        this.onLevelChange.next(this.currentLevel)
      }

      if (data.type === 'Hype Train End') {
        this.stop()
      } else if (data.type === 'Hype Train Progress') {
        if (data.event.last_contribution) {
          if (data.event.top_contributions && data.event.top_contributions.length > 0) {
            for (let c of data.event.top_contributions) await this.addCarriage(c)
          }
          await this.addCarriage(data.event.last_contribution)
        }
      }

      this.onProgress.next(this.progress)

      console.log(this.currentLevel, this.progress)

      /* 
      if (data.type === 'Hype Train Begin') {
        //this.currentLevel = 1
        //await this.onLevelChange()
      } else if (data.type === 'Hype Train Progress') {
        //let nextLevel = data.level !== this.currentLevel && this.currentLevel !== 6 ? true : false
        //this.currentLevel = data.level
        //if (nextLevel) await this.onLevelChange()
      } else if (data.type === 'Hype Train End') {
        //if (this.currentLevel < 5) this.prematureEnd = true
        //this.currentLevel = 6
        //this.expiryDate = 0
        //await this.onLevelChange()
      } */

      data.processed = true
      this.eventsSubject.next(data)
    })

    this.data.socketIO.on('hypetrain-test-start', (data) => this.start())
    this.data.socketIO.on('hypetrain-test-change-level', (data) => {
      this.testChangeLevel(data.level)
    })
    this.data.socketIO.on('hypetrain-test-add-carriage', (data) => this.addCarriage())
    this.data.socketIO.on('hypetrain-test-stop', (data) => this.stop())
  }

  async fetchUser() {
    this.channelPic = await this.data.get(`user/${this.data._userId}/picture`)
  }

  async queueUp(event) {
    this.eventsQueue.push(event)
    await this.processNext()
  }
  currentlyProcessed
  private processed = 0
  private async processNext() {
    console.log('playnext')
    if (this.eventsQueue.length < 1 || this.processed > 0) return false

    this.processed++
    this.currentlyProcessed = this.eventsQueue.splice(0, 1)[0]
    this.eventsSubject.next(this.currentlyProcessed)
    return true
  }

  start() {
    if (this.currentLevel > 0) return
    this.onLevelChange.next(++this.currentLevel)
  }
  changeLevel(level) {
    if (level === this.currentLevel) return
    this.currentLevel = level
    this.onLevelChange.next(level)
  }

  async addCarriage(lastContribution?) {
    if (lastContribution) {
      let found = await from(this.carriages)
        .pipe(
          filter((c: any) => c.user.name === lastContribution.user_name),
          take(1)
        )
        .toPromise()
      if (found) {
        found.user.total = lastContribution.total
      } else {
        this.carriages.push({
          viewport: this.settings.viewport,
          size: this.settings.hypetrain.train.carriage.size,
          scale: this.settings.hypetrain.train.carriage.scale,
          pictureBounds: this.settings.hypetrain.train.carriage.pictureBounds,
          backgroundPic: this.settings.hypetrain.train.carriage.pictures.background,
          foregroundPic: this.settings.hypetrain.train.carriage.pictures.foreground,
          user: {
            name: lastContribution.user_name,
            picture: lastContribution.picture || this.channelPic,
            total: lastContribution.total,
          },
        })
      }

      let contribution = lastContribution.type === 'bits' ? lastContribution.total : lastContribution.total / 500
      if (contribution < 1) contribution = 1
    } else {
      this.carriages.push({
        viewport: this.settings.viewport,
        size: this.settings.hypetrain.train.carriage.size,
        scale: this.settings.hypetrain.train.carriage.scale,
        pictureBounds: this.settings.hypetrain.train.carriage.pictureBounds,
        backgroundPic: this.settings.hypetrain.train.carriage.pictures.background,
        foregroundPic: this.settings.hypetrain.train.carriage.pictures.foreground,
        user: { name: 'eltharynd', picture: this.channelPic, total: Math.floor((Math.random() * 100 + 1) * 100) },
      })
    }

    this.onProgress.next(this.currentLevel)
  }
  stop() {
    this.currentLevel = 0
    this.ending = false
    this.expiresAt = null
    this.progress = 0
    this.carriages = []

    this.onLevelChange.next(0)
  }

  testStart() {
    this.start()
    this.data.socketIO.emit('hypetrain-test-start', {
      userId: this.auth.currentUser?._id,
    })
  }
  testChangeLevel(level) {
    if (level === this.currentLevel) return
    this.changeLevel(level)
    this.data.socketIO.emit('hypetrain-test-change-level', {
      userId: this.auth.currentUser?._id,
      level: level,
    })
  }
  testAddCarriage() {
    this.addCarriage()
    this.data.socketIO.emit('hypetrain-test-add-carriage', {
      userId: this.auth.currentUser?._id,
    })
  }
  testStop() {
    this.stop()
    this.data.socketIO.emit('hypetrain-test-stop', {
      userId: this.auth.currentUser?._id,
    })
  }
}
