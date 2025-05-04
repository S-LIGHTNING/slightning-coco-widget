import { capitalize } from "../../utils"
import { AnyType, FunctionType, ObjectType, StringEnumType, VoidType } from "../type"
import { EventParamTypes, MethodBlockParam, MethodGroup, MethodParamTypes, MethodsTypes, MethodTypes, Types } from "../types"
import { emit } from "../utils"
import { Widget } from "../widget"

export function transformMethodsCallbackFunctionsToEvents(types: Types, widget: Widget): [Types, Widget] {
    const argumentsTransformersMap: Record<string, ((arg: unknown) => unknown)[]> =
        methodsTransformCallbackFunctionsToEvents(types.methods, types, widget)
        return [types, new Proxy(widget, {
            construct(target: Widget, argArray: any[], newTarget: Function): object {
                return new Proxy(Reflect.construct(target, argArray, newTarget), {
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
                                        argArray[i] = transformer.call(thisArg, argArray[i])
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

function methodsTransformCallbackFunctionsToEvents(
    methods: MethodsTypes,
    types: Types,
    widget: Widget
): Record<string, ((arg: unknown) => unknown)[]> {
    const argumentsTransformersMap: Record<string, ((arg: unknown) => unknown)[]> = {}
    for (let i: number = 0; i <= methods.length; i++) {
        const method: MethodGroup | MethodTypes | undefined = methods[i]
        if (method == undefined) {
            continue
        }
        if ("contents" in method) {
            Object.assign(argumentsTransformersMap, methodsTransformCallbackFunctionsToEvents(method.contents, types, widget))
            continue
        }
        const map: ((arg: unknown) => unknown)[] | null =
            methodTransformCallbackFunctionsToEvents(method, methods, i, types, widget)
        if (map != null) {
            argumentsTransformersMap[method.key] = map
        }
    }
    return argumentsTransformersMap
}

function methodTransformCallbackFunctionsToEvents(
    method: MethodTypes,
    methods: MethodsTypes,
    index: number,
    types: Types,
    widget: Widget
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
        if (!(part.type instanceof FunctionType && !part.type.raw)) {
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
        const eventParams: EventParamTypes[] = [
            {
                key: "__slightning_coco_widget_call_data__",
                label: label,
                type: callDataType
            }, {
                key: "__slightning_coco_widget_call_context__",
                label: "上下文",
                type: new AnyType()
            }
        ]
        for (const part of type.block) {
            if (typeof part != "object") {
                continue
            }
            eventParams.push({
                key: part.key,
                label: part.label,
                type: part.type
            })
        }
        types.events.push({
            key,
            label,
            params: eventParams
        })
        method.block.splice(i, 1, `${part.label}上下文`, {
            key: `${part.key}__slightning_coco_widget_call_context__`,
            label: `${part.label}上下文`,
            type: new AnyType({
                defaultValue: `${part.label}上下文`
            })
        })
        i++
        argumentsTransformers.push(function (this: any, context: unknown): (...args: unknown[]) => unknown {
            const widget: any = this
            return function (...args: unknown[]): unknown {
                let promiseResolve: ((result: unknown) => void) | null = null
                let promiseReject: ((reason: unknown) => void) | null = null
                const callData: callData = {
                    state: "undone",
                    resolve(result: unknown): void {
                        if (callData.state == "undone") {
                            callData.state = "resolved"
                            callData.value = result
                            promiseResolve?.(result)
                        }
                    },
                    reject(reason: unknown): void {
                        if (callData.state == "undone") {
                            callData.state = "rejected"
                            callData.value = reason
                            promiseReject?.(reason)
                        }
                    }
                }
                emit.call(widget, key, callData, context, ...args)
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
                        key: "exception",
                        label: "异常",
                        type: type.throws
                    }
                ],
                returns: new VoidType()
            })
            widget.prototype[`${key}Throw`] = function (callData: callData, exception: unknown): void {
                callData.reject(exception)
            }
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
                widget.prototype[`${key}Return`] = function (callData: callData): void {
                    callData.resolve(undefined)
                }
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
                widget.prototype[`${key}Return`] = function (callData: callData, returnValue: unknown): void {
                    callData.resolve(returnValue)
                }
            }
        }
    }
    if (argumentsTransformers.length == 0) {
        return null
    }
    return argumentsTransformers
}
