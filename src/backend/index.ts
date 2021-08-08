import * as fs from 'fs'
import { Mongo } from './db/mongo'
import { Api } from './api/express'
import { Socket } from './socket/socket'
import { User } from './db/models/user'
import { Chat } from './twitch/chat'
import { RefreshingAuthProvider } from '@twurple/auth'
import { Settings } from './db/models/settings'
import { Twitch } from './twitch/twitch'
import { ClientToken } from './db/models/tokens'

export const PORT = 3000

export const MONGO = JSON.parse('' + fs.readFileSync('mongo_credentials.json'))
export const ENDPOINT = JSON.parse('' + fs.readFileSync('endpoint_credentials.json'))

export var channelID

let startApp = async () => {

  await Mongo.connect()

  new Api()
  new Socket()


  let clientToken: any = await ClientToken.findOne()
  Chat.defaultUserProvider = new RefreshingAuthProvider(
    {
      clientId: Mongo.clientId,
      clientSecret: Mongo.clientSecret,
      onRefresh: async (token) => {
        let defaultUserToken: any = await ClientToken.findOne()
        defaultUserToken.accesToken = token.accessToken
        defaultUserToken.refreshToken = token.refreshToken
        defaultUserToken.expiresIn = token.expiresIn
        defaultUserToken.obtainmentTimestamp = Date.now()
        await defaultUserToken.save()
      },
    },
    clientToken.toJSON()
  )
  let settings: any[] = await Settings.find()

  for(let s of settings) {
    let user: any = await User.findOne({_id: s.userId})
    if(!user) {
      await Settings.deleteOne({_id: s._id})
      continue
    }
    let ss = s.json
    if(ss.api.enabled) {
      await Twitch.connect(user.toJSON(), ss)
    }
    if(ss.chatbot.enabled) {
      await Chat.connect(user.toJSON(), ss)
    }
  }
}
startApp()
