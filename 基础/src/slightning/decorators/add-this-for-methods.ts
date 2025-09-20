import { recordDecoratorOperation } from "./utils"
import { MethodBlockParam, StandardTypes } from "../types"
import { Widget } from "../widget"
import { MethodTypesNode, traverseTypes } from "./utils"

export function addThisForMethods(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            const { value: method } = node
            if (!method.block.includes(MethodBlockParam.THIS)) {
                if (method.block.includes(MethodBlockParam.BREAK_LINE)) {
                    method.block.unshift(MethodBlockParam.THIS, MethodBlockParam.BREAK_LINE)
                } else {
                    method.block.unshift(MethodBlockParam.THIS)
                }
            }
        }
    })
    recordDecoratorOperation(widget)
    return [types, widget]
}
