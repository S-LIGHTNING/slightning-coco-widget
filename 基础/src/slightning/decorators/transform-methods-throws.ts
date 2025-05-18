import { VoidType } from "../type"
import { MethodGroup, MethodsTypes, MethodTypes, Types } from "../types"
import { Widget } from "../widget"
import { addTransformMethodsThrows } from "./add-transform-methods-throws"

export function transformMethodsThrows(types: Types, widget: Widget): [Types, Widget] {
    addTransformMethodsThrows(types, widget)
    removeMethodsWithThrows(types.methods)
    return [types, widget]
}

function removeMethodsWithThrows(methods: MethodsTypes): void {
    for (let i: number = methods.length - 1; i >= 0; i--) {
        const method: MethodTypes | MethodGroup | undefined = methods[i]
        if (method === undefined) {
            continue
        }
        if ("contents" in method) {
            removeMethodsWithThrows(method.contents)
            continue
        }
        if (method.throws != null && !(method.throws instanceof VoidType)) {
            methods.splice(i, 1)
        }
    }
}
