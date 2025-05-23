import { capitalize } from "../../utils"
import { FunctionType, InstanceType, ObjectType, StringEnumType, VoidType } from "../type"
import { MethodBlockParam, MethodGroup, MethodParamTypes, MethodsTypes, MethodTypes, Types } from "../types"
import { Widget } from "../widget"
import { methodParamNeedsTransformToCodeBlocks } from "./utils"

export function addTransformMethodsCallbackFunctionsToCodeBlocks(types: Types, widget: Widget): [Types, Widget] {
    methodsTransformCallbackFunctionsToCodeBlocks(types.methods, types, widget)
    return [types, widget]
}

function methodsTransformCallbackFunctionsToCodeBlocks(
    methods: MethodsTypes,
    types: Types,
    widget: Widget
): void {
    for (let i: number = methods.length - 1; i >= 0; i--) {
        const method: MethodGroup | MethodTypes | undefined = methods[i]
        if (method == undefined) {
            continue
        }
        if ("contents" in method) {
            methodsTransformCallbackFunctionsToCodeBlocks(method.contents, types, widget)
            continue
        }
        methodTransformCallbackFunctionsToCodeBlocks(method, methods, i, widget)
    }
}

function methodTransformCallbackFunctionsToCodeBlocks(
    originalMethod: MethodTypes,
    methods: MethodsTypes,
    index: number,
    widget: Widget
): void {
    if (!originalMethod.block.some(methodParamNeedsTransformToCodeBlocks)) {
        return
    }
    let argumentsTransformers: ((arg: unknown) => unknown)[] = []
    const transformedMethod: MethodTypes = {
        ...originalMethod,
        key: `__slightning_coco_widget_transformed_callback_function_to_code_blocks__${originalMethod.key}`,
        block: [...originalMethod.block]
    }
    for (let i: number = 0; i < transformedMethod.block.length; i++) {
        const part: string | MethodBlockParam | MethodParamTypes | undefined = transformedMethod.block[i]
        if (part == undefined) {
            continue
        }
        if (typeof part != "object") {
            continue
        }
        if (!methodParamNeedsTransformToCodeBlocks(part)) {
            argumentsTransformers.push((arg: unknown): unknown => arg)
            continue
        }
        const key = `${transformedMethod.key}${capitalize(part.key)}`
        const label = `${transformedMethod.label}·${part.label}`
        const type = new FunctionType({
            block: [...part.type.block],
            returns: part.type.returns,
            throws: part.type.throws,
            defaultValue: part.type.defaultValue
        })
        transformedMethod.block[i] = {
            key: `__slightning_coco_widget_transformed_callback_function_to_code_blocks__${part.key}`,
            label: part.label,
            type: new FunctionType({
                block: type.block,
                defaultValue: type.defaultValue
            })
        }
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
                state: new StringEnumType({
                    entries: [
                        { label: "未完成", value: "undone" },
                        { label: "已解决", value: "resolved" },
                        { label: "已拒绝", value: "rejected" }
                    ]
                }),
                resolve: new InstanceType({
                    theClass: ResolveRef
                }),
                reject: new InstanceType({
                    theClass: RejectRef
                })
            },
            defaultValue: label
        })
        type.block.unshift({
            key: "__slightning_coco_widget_call_data__",
            label: part.label,
            type: callDataType
        })
        argumentsTransformers.push(function (originalFunction: unknown): unknown {
            if (typeof originalFunction != "function") {
                return originalFunction
            }
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
                key: `__slightning_coco_widget_throw__${key}`,
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
                returns: new VoidType(),
                blockOptions: transformedMethod.blockOptions
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
            methods.splice(index + 1, 0, {
                key: `__slightning_coco_widget_return__${key}`,
                label: `${label}返回`,
                block: [
                    {
                        key: "__slightning_coco_widget_call_data__",
                        label,
                        type: callDataType
                    }, "返回", ...type.returns instanceof VoidType ? [] : [{
                        key: "returnValue",
                        label: "返回值",
                        type: type.returns
                    }]
                ],
                returns: new VoidType(),
                blockOptions: transformedMethod.blockOptions
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
    }
    Object.defineProperty(widget.prototype, transformedMethod.key, {
        value: function (...args: unknown[]): unknown {
            const transformedArgs: unknown[] = []
            for (let i: number = 0; i < args.length; i++) {
                transformedArgs.push(argumentsTransformers[i]?.call(this, args[i]))
            }
            return this[originalMethod.key].apply(this, transformedArgs)
        },
        writable: true,
        enumerable: false,
        configurable: true
    })
    methods.splice(index, 0, transformedMethod)
}
