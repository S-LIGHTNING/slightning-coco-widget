import { capitalize } from "../../utils"
import { EventSubType, EventTypes, Types } from "../types"
import { eventKeyMap } from "../utils"
import { Widget } from "../widget"

export function addFlattenEventSubTypes(types: Types, widget: Widget): [Types, Widget] {
    for (let i: number = types.events.length - 1; i >= 0; i--) {
        const event: EventTypes | undefined = types.events[i]
        if (event == undefined) {
            continue
        }
        if (event.subTypes == null) {
            continue
        }
        types.events.splice(i, 0, ...flattenSubTypes(
            event.subTypes, 0, [event.key], [event.label], event
        ))
    }
    return [types, widget]
}

function flattenSubTypes(
    subTypes: EventSubType[],
    i: number,
    keys: string[],
    labels: string[],
    event: EventTypes
): EventTypes[] {
    const result: EventTypes[] = []
    if (i >= subTypes.length) {
        const key: string = keys.join("")
        eventKeyMap[key] = `__slightning_coco_widget_flatten_event_sub_types__${key}`
        return [{
            key: `__slightning_coco_widget_flatten_event_sub_types__${key}`,
            label: labels.join(" "),
            params: event.params,
            tooltip: event.tooltip,
            blockOptions: event.blockOptions
        }]
    }
    const subType: EventSubType | undefined = subTypes[i]
    if (subType == undefined) {
        return flattenSubTypes(subTypes, i + 1, keys, labels, event)
    }
    for (const item of subType.dropdown) {
        result.push(...flattenSubTypes(
            subTypes, i + 1, [...keys, capitalize(item.value)], [...labels, item.label], event
        ))
    }
    return result
}
