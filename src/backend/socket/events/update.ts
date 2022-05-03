import { EventSubChannelUpdateEvent} from "@twurple/eventsub/lib"
import { User } from "../../db/models/user"
import { Socket } from "../socket"
import { toJSON } from "./util/toJSON"

export class UpdateHandler {

    static updateEvent = async (event: EventSubChannelUpdateEvent) => {
        let data = toJSON(event)
        data.type = 'Update'
        console.log(data)

        let found: any = await User.findOne({twitchId: event.broadcasterId})
        if(found)
            Socket.io.to(found._id.toString()).emit('alerts', data)
    }

}