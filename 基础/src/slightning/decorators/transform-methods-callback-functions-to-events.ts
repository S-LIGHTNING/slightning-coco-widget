import { StandardTypes } from "../types"
import { Widget } from "../widget"
import { addTransformMethodsCallbackFunctionsToEvents } from "./add-transform-methods-callback-functions-to-events"
import { methodParamNeedsTransformToEvent, MethodTypesNode, traverseTypes } from "./utils"

export function transformMethodsCallbackFunctionsToEvents(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    [types, widget] = addTransformMethodsCallbackFunctionsToEvents(types, widget)
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (node.value.block.some(methodParamNeedsTransformToEvent)) {
                node.remove()
            }
        }
    })
    return [types, widget]
}
