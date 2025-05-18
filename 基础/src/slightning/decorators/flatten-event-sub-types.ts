import { EventTypes, Types } from "../types"
import { Widget } from "../widget"
import { addFlattenEventSubTypes } from "./add-flatten-event-sub-types"

export function flattenEventSubTypes(types: Types, widget: Widget): [Types, Widget] {
    [types, widget] = addFlattenEventSubTypes(types, widget)
    for (let i: number = types.events.length - 1; i >= 0; i--) {
        const event: EventTypes | undefined = types.events[i]
        if (event == undefined) {
            continue
        }
        if (event.subTypes == null) {
            continue
        }
        types.events.splice(i, 1)
    }
    return [types, widget]
}
