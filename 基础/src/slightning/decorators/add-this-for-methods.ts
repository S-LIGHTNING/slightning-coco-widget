import { MethodBlockParam, StandardTypes } from "../types"
import { Widget } from "../widget"
import { MethodTypesNode, traverseTypes } from "./utils"

export function addThisForMethods(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (!node.value.block.includes(MethodBlockParam.THIS)) {
                node.value.block.unshift(MethodBlockParam.THIS)
            }
        }
    })
    return [types, widget]
}
