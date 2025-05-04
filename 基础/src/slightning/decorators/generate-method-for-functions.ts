import { capitalize } from "../../utils"
import { FunctionType } from "../type"
import { MethodGroup, MethodsTypes, MethodTypes, Types } from "../types"
import { Widget } from "../widget"

export function generateMethodForFunctions(types: Types, widget: Widget): [Types, Widget] {
    generateMethodsForMethodFunctions(types, widget)
    generateMethodForEventsFunctions(types, widget)
    return [types, widget]
}

function generateMethodsForMethodFunctions(types: Types, widget: Widget): void {
    methodsGenerateForMethodFunctions(types.methods, widget)
}

function methodsGenerateForMethodFunctions(methods: MethodsTypes, widget: Widget): void {
    for (let i: number = 0; i < methods.length; i++) {
        const method: MethodGroup | MethodTypes | undefined = methods[i]
        if (method == undefined) {
            continue
        }
        if ("contents" in method) {
            methodsGenerateForMethodFunctions(method.contents, widget)
            continue
        }
        for (const part of method.block) {
            if (typeof part != "object") {
                continue
            }
            if (part.type instanceof FunctionType) {
                methods.splice(i + 1, 0, ...generateMethodsForFunctionParams(
                    [method.key, capitalize(part.key)],
                    [method.label, part.label],
                    part.type,
                    widget
                ))
            }
            if (method.returns instanceof FunctionType) {
                methods.splice(i + 1, 0, ...generateMethodsForFunction(
                    [method.key, "ReturnValue"],
                    [method.label, "返回值"],
                    method.returns,
                    widget
                ))
            }
            if (method.throws instanceof FunctionType) {
                methods.splice(i + 1, 0, ...generateMethodsForFunction(
                    [method.key, "ThrowValue"],
                    [method.label, "抛出值"],
                    method.throws,
                    widget
                ))
            }
        }
    }
}

function generateMethodForEventsFunctions(types: Types, widget: Widget): void {
    const methodsGroup: MethodGroup = {
        blockOptions: {
            color: "#608FEE"
        },
        contents: []
    }
    for (const event of types.events) {
        for (const param of event.params) {
            if (param.type instanceof FunctionType) {
                methodsGroup.contents.push(...generateMethodsForFunction(
                    [event.key, capitalize(param.key)],
                    [event.label, param.label],
                    param.type,
                    widget
                ))
            }
        }
    }
    types.methods.unshift(methodsGroup)
}

function generateMethodsForFunction(
    keys: string[],
    labels: string[],
    type: FunctionType<unknown[], unknown>,
    widget: Widget
): MethodTypes[] {
    const result: MethodTypes[] = []
    result.push(generateMethodForFunction(keys, labels, type, widget))
    for (const part of type.block) {
        if (typeof part != "object") {
            continue
        }
        if (part.type instanceof FunctionType) {
            result.push(...generateMethodsForFunctionParams(
                [...keys, capitalize(part.key)],
                [...labels, part.label],
                part.type,
                widget
            ))
        }
    }
    if (type.returns instanceof FunctionType) {
        result.push(generateMethodForFunction(
            [...keys, "ReturnValue"],
            [...labels, "返回值"],
            type.returns,
            widget
        ))
    }
    if (type.throws instanceof FunctionType) {
        result.push(generateMethodForFunction(
            [...keys, "ThrowValue"],
            [...labels, "抛出值"],
            type.throws,
            widget
        ))
    }
    return result
}

function generateMethodsForFunctionParams(
    keys: string[],
    labels: string[],
    type: FunctionType<unknown[], unknown>,
    widget: Widget
): MethodTypes[] {
    const result: MethodTypes[] = []
    for (const part of type.block) {
        if (typeof part != "object") {
            continue
        }
        if (part.type instanceof FunctionType) {
            result.push(...generateMethodsForFunction(
                [...keys, capitalize(part.key)],
                [...labels, part.label],
                part.type,
                widget
            ))
        }
    }
    return result
}

function generateMethodForFunction(
    keys: string[],
    labels: string[],
    type: FunctionType<unknown[], unknown>,
    widget: Widget
): MethodTypes {
    const key: string = keys.join("")
    const label: string = labels.join("·")
    widget.prototype[key] = function (func: (...args: unknown[]) => unknown, ...args: unknown[]): unknown {
        return func.apply(this, args)
    }
    return {
        key,
        label,
        block: [
            {
                key: "function",
                label: `函数`,
                type: new FunctionType({
                    block: type.block,
                    returns: type.returns,
                    throws: type.throws,
                    defaultValue: label,
                    raw: true
                })
            }, ...type.block
        ],
        returns: type.returns,
        throws: type.throws
    }
}
