import { FunctionType, InstanceType, ObjectType, VoidType } from "../type"
import { MethodGroup, MethodsTypes, MethodTypes, Types } from "../types"
import { Widget } from "../widget"

export function transformMethodsThrows(types: Types, widget: Widget): [Types, Widget] {
    const methodToBeProxy: Set<string> = methodsTransformThrows(types.methods, widget)
    return [types, new Proxy(widget, {
        construct(target: Widget, argArray: any[], newTarget: Function): object {
            return new Proxy(Reflect.construct(target, argArray, newTarget), {
                get(target: any, p: string | symbol, receiver: any): any {
                    const originalFunction: unknown = Reflect.get(target, p, receiver)
                    if (typeof p == "string" && methodToBeProxy.has(p) && typeof originalFunction == "function") {
                        return new Proxy(originalFunction, {
                            apply(target: Function, thisArg: any, argArray: any[]): any {
                                return {
                                    promise: (async (): Promise<unknown> =>
                                        Reflect.apply(target, thisArg, argArray)
                                    )()
                                }
                            }
                        })
                    }
                    return originalFunction
                }
            })
        },
    })]
}

function methodsTransformThrows(methods: MethodsTypes, widget: Widget): Set<string> {
    const methodToBeProxy: Set<string> = new Set()
    for (let i: number = methods.length - 1; i >= 0; i--) {
        const method: MethodGroup | MethodTypes | undefined = methods[i]
        if (method == undefined) {
            continue
        }
        if ("contents" in method) {
            for (const key of methodsTransformThrows(method.contents, widget)) {
                methodToBeProxy.add(key)
            }
            continue
        }
        if (method.throws == null || method.throws instanceof VoidType) {
            continue
        }
        const CallResultType = new ObjectType<{
            promise: Promise<unknown>
        }>({
            propertiesType: {
                promise: new InstanceType({
                    theClass: Promise
                })
            },
            defaultValue: method.label
        })
        const CallResultBlock = {
            key: method.key,
            label: method.label,
            type: CallResultType
        }
        methods.splice(i + 1, 0, {
            key: `${method.key}Continue`,
            label: `${method.label}继续`,
            block: [
                CallResultBlock, "继续"
            ],
            returns: method.returns,
            blockOptions: method.blockOptions
        }, {
            key: `${method.key}Then`,
            label: `${method.label}然后`,
            block: [
                CallResultBlock, "然后", {
                    key: "callback",
                    label: "回调",
                    type: new FunctionType({
                        block: method.returns != null && !(method.returns instanceof VoidType) ? ([
                            {
                                key: "result",
                                label: "结果",
                                type: method.returns
                            }
                        ]) : []
                    })
                }
            ],
            returns: new VoidType(),
            blockOptions: method.blockOptions
        }, {
            key: `${method.key}Catch`,
            label: `${method.label}捕获`,
            block: [
                CallResultBlock, "捕获", {
                    key: "callback",
                    label: "回调",
                    type: new FunctionType({
                        block: [
                            {
                                key: "error",
                                label: "错误",
                                type: method.throws
                            }
                        ]
                    })
                }
            ],
            returns: new VoidType(),
            blockOptions: method.blockOptions
        })
        methodToBeProxy.add(method.key)
        widget.prototype[`${method.key}Continue`] = function (
            { promise }: { promise: Promise<unknown> }
        ): Promise<unknown> {
            return promise
        }
        widget.prototype[`${method.key}Then`] = function (
            { promise }: { promise: Promise<unknown> },
            callback: (result: unknown) => void
        ): void {
            promise.then(callback)
        }
        widget.prototype[`${method.key}Catch`] = function (
            { promise }: { promise: Promise<unknown> },
            callback: (reason: unknown) => void
        ): void {
            promise.catch(callback)
        }
        method.returns = CallResultType
        method.throws = undefined
    }
    return methodToBeProxy
}
