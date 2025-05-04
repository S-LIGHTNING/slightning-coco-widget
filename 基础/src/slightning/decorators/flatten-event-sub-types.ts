import { EventParamTypes, EventSubType, EventTypes, Types } from "../types"
import { Widget } from "../widget"

export function flattenEventSubTypes(types: Types, widget: Widget): [Types, Widget] {
    for (let i: number = types.events.length - 1; i >= 0; i--) {
        const event: EventTypes | undefined = types.events[i]
        if (event == undefined) {
            continue
        }
        if (event.subTypes == null) {
            continue
        }
        types.events.splice(i, 1, ...flattenSubTypes(
            event.subTypes, 0, [event.key], [event.label], event.params
        ))
    }
    return [types, widget]
}

function flattenSubTypes(
    subTypes: EventSubType[],
    i: number,
    keys: string[],
    labels: string[],
    params: EventParamTypes[]
): EventTypes[] {
    const result: EventTypes[] = []
    if (i >= subTypes.length) {
        return [{
            key: keys.join(""),
            label: labels.join(" "),
            params
        }]
    }
    const subType: EventSubType | undefined = subTypes[i]
    if (subType == undefined) {
        return flattenSubTypes(subTypes, i + 1, keys, labels, params)
    }
    for (const item of subType.dropdown) {
        result.push(...flattenSubTypes(
            subTypes, i + 1, [...keys, item.value], [...labels, item.label], params
        ))
    }
    return result
}
