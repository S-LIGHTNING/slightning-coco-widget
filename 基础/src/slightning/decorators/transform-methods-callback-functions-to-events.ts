import { MethodGroup, MethodsTypes, MethodTypes, Types } from "../types"
import { Widget } from "../widget"
import { addTransformMethodsCallbackFunctionsToEvents } from "./add-transform-methods-callback-functions-to-events"
import { methodParamNeedsTransformToEvent } from "./utils"

export function transformMethodsCallbackFunctionsToEvents(types: Types, widget: Widget): [Types, Widget] {
    addTransformMethodsCallbackFunctionsToEvents(types, widget)
    removeMethodsWithCallbackFunction(types.methods)
    return [types, widget]
}

function removeMethodsWithCallbackFunction(methods: MethodsTypes): void {
    for (let i: number = methods.length - 1; i >= 0; i--) {
        const method: MethodTypes | MethodGroup | undefined = methods[i]
        if (method == undefined) {
            continue
        }
        if ("contents" in method) {
            removeMethodsWithCallbackFunction(method.contents)
            continue
        }
        if (method.block.some(methodParamNeedsTransformToEvent)) {
            methods.splice(i, 1)
        }
    }
}
