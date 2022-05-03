import { Schema, model } from "mongoose"
import * as merge from 'deepmerge'

const ALERT_TEMPLATE = {
  name: 'An alert',
  conditions: [{
    type: 'bit',
    operator: 'equals',
    compared: 1
  }],
  elements: []
}

export const alertsSchema: Schema = new Schema({
  userId: Schema.Types.ObjectId,
  alerts: {
    type: Object,
    get: (data) => {
      try { return merge(ALERT_TEMPLATE, JSON.parse(data)) } catch(e) { return merge(ALERT_TEMPLATE, data) }
    },
    set: (data) => JSON.stringify(data),
    default: {}
  }
})
export const Alerts = model('Alerts', alertsSchema)