import { capitalize } from "../../utils"
import { BlockType, StandardEventSubType, StandardEventTypes, StandardTypes } from "../types"
import { eventKeyMap } from "../utils"
import { Widget } from "../widget"
import { EventTypesNode, traverseTypes } from "./utils"

export function addFlattenEventSubTypes(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        EventTypes(node: EventTypesNode): void {
            if (node.value.subTypes == null || node.value.subTypes.length == 0) {
                return
            }
            node.insertAfter(...flattenSubTypes(
                node.value.subTypes, 0, [node.value.key], [node.value.label], node.value
            ))
        }
    })
    return [types, widget]
}

function flattenSubTypes(
    subTypes: StandardEventSubType[],
    i: number,
    keys: string[],
    labels: string[],
    event: StandardEventTypes
): StandardEventTypes[] {
    const result: StandardEventTypes[] = []
    if (i >= subTypes.length) {
        const key: string = keys.join("")
        eventKeyMap[key] = `__slightning_coco_widget_flatten_event_sub_types__${key}`
        return [{
            type: BlockType.EVENT,
            key: `__slightning_coco_widget_flatten_event_sub_types__${key}`,
            label: labels.join(" "),
            params: event.params,
            tooltip: event.tooltip,
            blockOptions: event.blockOptions
        }]
    }
    const subType: StandardEventSubType | undefined = subTypes[i]
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
