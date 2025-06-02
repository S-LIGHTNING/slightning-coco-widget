import { StandardTypes } from "../types"
import { Widget } from "../widget"
import { addTransformMethodsCallbackFunctionsToCodeBlocks } from "./add-transform-methods-callback-functions-to-code-blocks"
import { methodParamNeedsTransformToCodeBlocks, MethodTypesNode, traverseTypes } from "./utils"

export function transformMethodsCallbackFunctionsToCodeBlocks(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    [types, widget] = addTransformMethodsCallbackFunctionsToCodeBlocks(types, widget)
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (node.value.block.some(methodParamNeedsTransformToCodeBlocks)) {
                node.remove()
            }
        }
    })
    return [types, widget]
}
