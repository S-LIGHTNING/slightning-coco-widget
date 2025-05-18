import { capitalize } from "../../utils"
import { FunctionType, Type } from "../type"
import { MethodBlockOptionsTypes, MethodBlockParam, MethodGroup, MethodParamTypes, MethodsTypes, MethodTypes, Types } from "../types"
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
    for (let i: number = methods.length - 1; i >= 0; i--) {
        const method: MethodGroup | MethodTypes | undefined = methods[i]
        if (method == undefined) {
            continue
        }
        if ("contents" in method) {
            methodsGenerateForMethodFunctions(method.contents, widget)
            continue
        }
        if (method.throws != null) {
            methods.splice(i + 1, 0, ...generateMethodsForEfferent(
                [method.key, "__slightning_coco_widget_function_throw_value__"],
                [method.label, "抛出值"],
                method.throws,
                method.blockOptions,
                widget
            ))
        }
        if (method.returns != null) {
            methods.splice(i + 1, 0, ...generateMethodsForEfferent(
                [method.key, "__slightning_coco_widget_function_return_value__"],
                [method.label, "返回值"],
                method.returns,
                method.blockOptions,
                widget
            ))
        }
        for (let j: number = method.block.length - 1; j >= 0; j--) {
            const part: string | MethodBlockParam | MethodParamTypes | undefined = method.block[j]
            if (typeof part != "object") {
                continue
            }
            methods.splice(i + 1, 0, ...generateMethodsForAfferent(
                [method.key, "__slightning_coco_widget_function_param__", part.key],
                [method.label, "参数", part.label],
                part.type,
                method.blockOptions,
                widget
            ))
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
                methodsGroup.contents.push(...generateMethodsForEfferent(
                    [event.key, "__slightning_coco_widget_event_param__", capitalize(param.key)],
                    [event.label, "参数", param.label],
                    param.type,
                    event.blockOptions,
                    widget
                ))
            }
        }
    }
    types.methods.unshift(methodsGroup)
}

function generateMethodsForEfferent(
    keys: string[],
    labels: string[],
    type: Type<unknown>,
    blockOptions: MethodBlockOptionsTypes | null | undefined,
    widget: Widget
): MethodTypes[] {
    const result: MethodTypes[] = []
    if (type instanceof FunctionType && !type.raw) {
        result.push(generateMethodForFunction(keys, labels, type, blockOptions, widget))
    }
    for (const child of type.getSameDirectionChildren()) {
        result.push(...generateMethodsForEfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    for (const child of type.getReverseDirectionChildren()) {
        result.push(...generateMethodsForAfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    return result
}

function generateMethodsForAfferent(
    keys: string[],
    labels: string[],
    type: Type<unknown>,
    blockOptions: MethodBlockOptionsTypes | null | undefined,
    widget: Widget
): MethodTypes[] {
    const result: MethodTypes[] = []
    for (const child of type.getSameDirectionChildren()) {
        result.push(...generateMethodsForAfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    for (const child of type.getReverseDirectionChildren()) {
        result.push(...generateMethodsForEfferent(
            [...keys, capitalize(child.key)],
            [...labels, child.label],
            child.type,
            blockOptions,
            widget
        ))
    }
    return result
}

function generateMethodForFunction(
    keys: string[],
    labels: string[],
    type: FunctionType<unknown[], unknown>,
    blockOptions: MethodBlockOptionsTypes | null | undefined,
    widget: Widget
): MethodTypes {
    const key: string = `__slightning_coco_widget_call_function__${keys.join("")}`
    const label: string = labels.join("·")
    Object.defineProperty(widget.prototype, key, {
        value: function (func: (...args: unknown[]) => unknown, ...args: unknown[]): unknown {
            return func.apply(this, args)
        },
        writable: true,
        enumerable: false,
        configurable: true
    })
    return {
        key,
        label,
        block: [
            {
                key: "__slightning_coco_widget_function__",
                label,
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
        throws: type.throws,
        blockOptions
    }
}
