import { capitalize } from "../../utils"
import { FunctionType, ObjectType, StringEnumType, VoidType } from "../type"
import { MethodBlockParam, MethodGroup, MethodParamTypes, MethodsTypes, MethodTypes, Types } from "../types"
import { Widget } from "../widget"

export function transformMethodsCallbackFunctionsToCodeBlocks(types: Types, widget: Widget): [Types, Widget] {
    const argumentsTransformersMap: Record<string, ((arg: unknown) => unknown)[]> =
        methodsTransformCallbackFunctionsToCodeBlocks(types.methods, types)
    return [types, new Proxy(widget, {
        construct(target: Widget, argArray: any[], newTarget: Function): object {
            const widget: any = Reflect.construct(target, argArray, newTarget)
            return new Proxy(widget, {
                get(target: any, p: string | symbol, receiver: any): any {
                    const originalFunction: unknown = Reflect.get(target, p, receiver)
                    if (typeof p == "string" && p in argumentsTransformersMap && typeof originalFunction == "function") {
                        return new Proxy(originalFunction, {
                            apply(target: Function, thisArg: any, argArray: any[]): any {
                                const transformers: ((arg: unknown) => unknown)[] = argumentsTransformersMap[p]!
                                for (let i: number = 0; i < argArray.length; i++) {
                                    const transformer: ((arg: unknown) => unknown) | undefined = transformers[i]
                                    if (transformer == undefined) {
                                        continue
                                    }
                                    argArray[i] = transformer.call(target, argArray[i])
                                }
                                return Reflect.apply(target, thisArg, argArray)
                            }
                        })
                    }
                    return originalFunction
                }
            })
        },
    })]
}

function methodsTransformCallbackFunctionsToCodeBlocks(
    methods: MethodsTypes,
    types: Types
): Record<string, ((arg: unknown) => unknown)[]> {
    const argumentsTransformersMap: Record<string, ((arg: unknown) => unknown)[]> = {}
    for (let i: number = 0; i <= methods.length; i++) {
        const method: MethodGroup | MethodTypes | undefined = methods[i]
        if (method == undefined) {
            continue
        }
        if ("contents" in method) {
            Object.assign(argumentsTransformersMap, methodsTransformCallbackFunctionsToCodeBlocks(method.contents, types))
            continue
        }
        const map: ((arg: unknown) => unknown)[] | null =
            methodTransformCallbackFunctionsToCodeBlocks(method, methods, i)
        if (map != null) {
            argumentsTransformersMap[method.key] = map
        }
    }
    return argumentsTransformersMap
}

function methodTransformCallbackFunctionsToCodeBlocks(
    method: MethodTypes,
    methods: MethodsTypes,
    index: number
): ((arg: unknown) => unknown)[] | null {
    const argumentsTransformers: ((arg: unknown) => unknown)[] = []
    for (let i: number = 0; i < method.block.length; i++) {
        const part: string | MethodBlockParam | MethodParamTypes | undefined = method.block[i]
        if (part == undefined) {
            continue
        }
        if (typeof part != "object") {
            continue
        }
        if (
            !(part.type instanceof FunctionType) ||
            part.type.raw || (
                (part.type.returns == null || part.type.returns instanceof VoidType) &&
                (part.type.throws == null || part.type.throws instanceof VoidType)
            )
        ) {
            argumentsTransformers.push((arg: unknown): unknown => arg)
            continue
        }
        const key = `${method.key}${capitalize(part.key)}`
        const label = `${method.label}·${part.label}`
        const type = part.type
        type callData = {
            state: "undone" | "resolved" | "rejected"
            value?: unknown
            resolve(result: unknown): void
            reject(reason: unknown): void
        }
        const callDataType: ObjectType<callData> = new ObjectType<callData>({
            propertiesType: {
                state: new StringEnumType({
                    entries: [
                        { label: "未完成", value: "undone" },
                        { label: "已解决", value: "resolved" },
                        { label: "已拒绝", value: "rejected" }
                    ]
                }),
                resolve: new FunctionType({
                    block: [
                        "解决", "结果", {
                            key: "result",
                            label: "结果",
                            type: type.returns ?? new VoidType()
                        }
                    ],
                    returns: new VoidType()
                }),
                reject: new FunctionType({
                    block: [
                        "拒绝", "原因", {
                            key: "reason",
                            label: "原因",
                            type: type.throws ?? new VoidType()
                        }
                    ],
                    returns: new VoidType()
                })
            },
            defaultValue: label
        })
        type.block.unshift({
            key: "__slightning_coco_widget_call_data__",
            label: label,
            type: callDataType
        })
        method.block[i] = {
            key: part.key,
            label: part.label,
            type: new FunctionType({
                block: part.type.block,
                returns: undefined,
                throws: undefined,
                defaultValue: part.type.defaultValue
            })
        }
        argumentsTransformers.push(function (originalFunction: unknown): unknown {
            if (typeof originalFunction != "function") {
                return originalFunction
            }
            return function (...args: unknown[]): unknown {
                let promiseResolve: ((result: unknown) => void) | null = null
                let promiseReject: ((reason: unknown) => void) | null = null
                const callData: callData = {
                    state: "undone",
                    resolve(result: unknown): void {
                        if (callData.state == "undone") {
                            callData.state = "resolved"
                            promiseResolve?.(result)
                        }
                    },
                    reject(reason: unknown): void {
                        if (callData.state == "undone") {
                            callData.state = "rejected"
                            promiseReject?.(reason)
                        }
                    }
                }
                originalFunction(callData, ...args)
                if (callData.state == "resolved") {
                    return callData.value
                } else if (callData.state == "rejected") {
                    throw callData.value
                }
                return new Promise((
                    resolve: (value: unknown) => void,
                    reject: (reason: unknown) => void
                ): void => {
                    promiseResolve = resolve
                    promiseReject = reject
                })
            }
        })
        if (type.throws != null && !(type.throws instanceof VoidType)) {
            methods.splice(index + 1, 0, {
                key: `${key}Throw`,
                label: `${label}抛出`,
                block: [
                    {
                        key: "__slightning_coco_widget_call_data__",
                        label: label,
                        type: callDataType
                    }, "抛出", {
                        key: "Exception",
                        label: "异常",
                        type: type.throws
                    }
                ],
                returns: new VoidType()
            })
        }
        if (type.returns != null) {
            if (type.returns instanceof VoidType) {
                methods.splice(index + 1, 0, {
                    key: `${key}Return`,
                    label: `${label}返回`,
                    block: [
                        {
                            key: "__slightning_coco_widget_call_data__",
                            label: label,
                            type: callDataType
                        }, "返回"
                    ],
                    returns: new VoidType()
                })
            } else {
                methods.splice(index + 1, 0, {
                    key: `${key}Return`,
                    label: `${label}返回`,
                    block: [
                        {
                            key: "__slightning_coco_widget_call_data__",
                            label: label,
                            type: callDataType
                        }, "返回", {
                            key: "returnValue",
                            label: "返回值",
                            type: type.returns
                        }
                    ],
                    returns: new VoidType()
                })
            }
        }
    }
    if (argumentsTransformers.length == 0) {
        return null
    }
    return argumentsTransformers
}
