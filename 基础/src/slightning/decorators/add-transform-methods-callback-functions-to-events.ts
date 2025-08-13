import { capitalize } from "../../utils"
import { AnyType, InstanceOfClassType, ObjectType, StringEnumType, VoidType } from "../type"
import { StandardEventParamTypes, MethodBlockParam, MethodParamTypes, StandardMethodTypes, StandardTypes, BlockType } from "../types"
import { emit } from "../utils"
import { Widget } from "../widget"
import { methodParamNeedsTransformToEvent, MethodTypesNode, traverseTypes } from "./utils"

export function addTransformMethodsCallbackFunctionsToEvents(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (!node.value.block.some(methodParamNeedsTransformToEvent)) {
                return
            }
            const argumentsTransformers: ((arg: unknown) => unknown)[] = []
            const transformedMethod: StandardMethodTypes = {
                ...node.value,
                key: `__slightning_coco_widget_transformed_callback_function_to_events__${node.value.key}`,
                block: [...node.value.block]
            }
            for (let i: number = 0; i < transformedMethod.block.length; i++) {
                const part: string | MethodBlockParam | MethodParamTypes | undefined = transformedMethod.block[i]
                if (part == undefined) {
                    continue
                }
                if (typeof part != "object") {
                    continue
                }
                if (!methodParamNeedsTransformToEvent(part)) {
                    argumentsTransformers.push((arg: unknown): unknown => arg)
                    continue
                }
                const key = `${transformedMethod.key}${capitalize(part.key)}`
                const label = `${transformedMethod.label}·${part.label}`
                const type = part.type
                class ResolveRef {
                    public readonly name: string = "解决函数引用"
                }
                class RejectRef {
                    public readonly name: string = "拒绝函数引用"
                }
                const resolveMap: WeakMap<ResolveRef, (value: unknown) => void> = new WeakMap()
                const rejectMap: WeakMap<RejectRef, (reason: unknown) => void> = new WeakMap()
                type callData = {
                    state: "undone" | "resolved" | "rejected"
                    value?: unknown
                    resolve: ResolveRef
                    reject: RejectRef
                }
                const callDataType: ObjectType<callData> = new ObjectType<callData>({
                    propertiesType: {
                        state: new StringEnumType([
                            ["未完成", "undone" ],
                            ["已解决", "resolved" ],
                            ["已拒绝", "rejected" ]
                        ]),
                        resolve: new InstanceOfClassType({
                            theClass: ResolveRef
                        }),
                        reject: new InstanceOfClassType({
                            theClass: RejectRef
                        })
                    },
                    defaultValue: label
                })
                const eventParams: StandardEventParamTypes[] = [
                    {
                        key: "__slightning_coco_widget_call_data__",
                        label: part.label,
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
                transformedMethod.block.splice(i, 1, part.label, "（上下文", {
                    key: `__slightning_coco_widget_call_context__${part.key}`,
                    label: `${part.label}（上下文）`,
                    type: new AnyType({
                        defaultValue: `${part.label}上下文`
                    })
                }, "）")
                i++
                argumentsTransformers.push(function (this: any, context: unknown): (...args: unknown[]) => unknown {
                    const widget: any = this
                    return function (...args: unknown[]): unknown {
                        let promiseResolve: ((result: unknown) => void) | null = null
                        let promiseReject: ((reason: unknown) => void) | null = null
                        function resolve(result: unknown): void {
                            if (callData.state == "undone") {
                                callData.state = "resolved"
                                callData.value = result
                                promiseResolve?.(result)
                            }
                        }
                        function reject(reason: unknown): void {
                            if (callData.state == "undone") {
                                callData.state = "rejected"
                                callData.value = reason
                                promiseReject?.(reason)
                            }
                        }
                        const resolveRef: ResolveRef = new ResolveRef()
                        const rejectRef: RejectRef = new RejectRef()
                        resolveMap.set(resolveRef, resolve)
                        rejectMap.set(rejectRef, reject)
                        const callData: callData = {
                            state: "undone",
                            resolve: resolveRef,
                            reject: rejectRef
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
                if (type.throws != null && !(type.throws.isVoid())) {
                    node.insertAfter({
                        space: 8
                    }, {
                        type: BlockType.METHOD,
                        key: `__slightning_coco_widget_throw__${key}`,
                        label: `${label}抛出`,
                        block: [
                            {
                                key: "__slightning_coco_widget_call_data__",
                                label,
                                type: callDataType
                            }, "抛出", {
                                key: "exception",
                                label: "异常",
                                type: type.throws
                            }
                        ],
                        returns: new VoidType(),
                        blockOptions: {
                            ...transformedMethod.blockOptions,
                            inline: true,
                            previousStatement: true,
                            nextStatement: false
                        }
                    })
                    Object.defineProperty(widget.prototype, `__slightning_coco_widget_throw__${key}`, {
                        value: function (callData: callData, exception: unknown): void {
                            const reject: ((reason: unknown) => void) | undefined = rejectMap.get(callData.reject)
                            if (reject == null) {
                                throw new Error("拒绝函数不存在")
                            }
                            reject(exception)
                        },
                        writable: true,
                        enumerable: false,
                        configurable: true
                    })
                }
                if (type.returns != null) {
                    node.insertAfter({
                        space: 8
                    }, {
                        type: BlockType.METHOD,
                        key: `__slightning_coco_widget_return__${key}`,
                        label: `${label}返回`,
                        block: [
                            {
                                key: "__slightning_coco_widget_call_data__",
                                label,
                                type: callDataType
                            }, "返回", ...(type.returns.isVoid() ? [] : [{
                                key: "returnValue",
                                label: "返回值",
                                type: type.returns
                            }])
                        ],
                        returns: new VoidType(),
                        blockOptions: {
                            ...transformedMethod.blockOptions,
                            inline: true,
                            previousStatement: true,
                            nextStatement: false
                        }
                    })
                    Object.defineProperty(widget.prototype, `__slightning_coco_widget_return__${key}`, {
                        value: function (callData: callData, returnValue: unknown): void {
                            const resolve: ((value: unknown) => void) | undefined = resolveMap.get(callData.resolve)
                            if (resolve == null) {
                                throw new Error("解决函数不存在")
                            }
                            resolve(returnValue)
                        },
                        writable: true,
                        enumerable: false,
                        configurable: true
                    })
                }
                node.insertAfter({
                    type: BlockType.EVENT,
                    key,
                    label: `${label}被调用`,
                    params: eventParams
                })
            }
            Object.defineProperty(widget.prototype, transformedMethod.key, {
                value: function (...args: unknown[]): unknown {
                    const transformedArgs: unknown[] = []
                    for (let i: number = 0; i < args.length; i++) {
                        transformedArgs.push(argumentsTransformers[i]?.call(this, args[i]))
                    }
                    return this[node.value.key].apply(this, transformedArgs)
                },
                writable: true,
                enumerable: false,
                configurable: true
            })
            node.insertAfter(transformedMethod)
        }
    })
    return [types, widget]
}
