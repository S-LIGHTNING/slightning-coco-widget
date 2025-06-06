import { StandardTypes } from "../types"
import { Widget } from "../widget"
import { addTransformMutator } from "./add-transform-mutator"
import { traverseTypes, MethodTypesNode, methodParamTypeIsMutator } from "./utils"

export function transformMutator(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    [types, widget] = addTransformMutator(types, widget)
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (node.value.block.some(methodParamTypeIsMutator)) {
                node.remove()
                node.removeNext()
            }
        }
    })
    return [types, widget]
}