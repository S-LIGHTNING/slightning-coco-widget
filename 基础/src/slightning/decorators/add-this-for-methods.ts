import { MethodBlockParam, MethodsTypes, Types } from "../types"
import { Widget } from "../widget"

export function addThisForMethods(types: Types, widget: Widget): [Types, Widget] {
    methodsAddThis(types.methods)
    return [types, widget]
}

function methodsAddThis(methods: MethodsTypes): void {
    for (const method of methods) {
        if ("contents" in method) {
            methodsAddThis(method.contents)
            continue
        }
        if (!method.block.includes(MethodBlockParam.THIS)) {
            method.block.unshift(MethodBlockParam.THIS)
        }
    }
}
