import { Schema, model, Document } from "mongoose"
import * as uuid from 'uuid'

export const userSchema: Schema = new Schema({
  token: {
    type: String,
    default : `${uuid.v4()}`
  },
  admin: Boolean,
  twitchId: String,
  twitchName: String,
  twitchPic: String,
  created: {
    type: Date,
    default: Date.now()
  }
})
export const User = model('User', userSchema)
