import { StandardTypes } from "../types"
import { Widget } from "../widget"
import { addTransformMethodsThrows } from "./add-transform-methods-throws"
import { traverseTypes, MethodTypesNode } from "./utils"

export function transformMethodsThrows(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    [types, widget] = addTransformMethodsThrows(types, widget)
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (node.value.throws != null && !(node.value.throws.isVoid())) {
                node.remove()
            }
        }
    })
    return [types, widget]
}
