import { StandardTypes } from "../types"
import { Widget } from "../widget"
import { addFlattenEventSubTypes } from "./add-flatten-event-sub-types"
import { EventTypesNode, traverseTypes } from "./utils"

export function flattenEventSubTypes(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    [types, widget] = addFlattenEventSubTypes(types, widget)
    traverseTypes(types, {
        EventTypes(node: EventTypesNode): void {
            if (node.value.subTypes != null && node.value.subTypes.length > 0) {
                node.remove()
            }
        }
    })
    return [types, widget]
}
