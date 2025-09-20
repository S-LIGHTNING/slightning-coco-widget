import { capitalize } from "../../utils"
import { FunctionType, ObjectType, StringEnumType, VoidType } from "../type"
import { BlockType, MethodBlockParam, MethodParamTypes, StandardMethodTypes, StandardTypes } from "../types"
import { Widget } from "../widget"
import { DecoratorAddMethodConfig, methodParamNeedsTransformToCodeBlocks, MethodTypesNode, recordDecoratorOperation, traverseTypes } from "./utils"

export function addTransformMethodsCallbackFunctionsToCodeBlocks(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    const addMethods: Record<string, DecoratorAddMethodConfig> = {}
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (!node.value.block.some(methodParamNeedsTransformToCodeBlocks)) {
                return
            }
            addMethods["__slightning_coco_widget_transformed_callback_function_to_code_blocks_transform_argument__"] = {
                args: ["original", `
                    if (typeof original != "function") {
                        return original
                    }
                    return function (...args) {
                        let promiseResolve = null
                        let promiseReject = null
                        const callData = Object.create({
                            state: "undone",
                            resolve(result) {
                                if (callData.state == "undone") {
                                    callData.state = "resolved"
                                    callData.value = result
                                    if (promiseResolve != null) {
                                        promiseResolve(result)
                                    }
                                }
                            },
                            reject(reason) {
                                if (callData.state == "undone") {
                                    callData.state = "rejected"
                                    callData.value = reason
                                    if (promiseReject != null) {
                                        promiseReject(reason)
                                    }
                                }
                            }
                        })
                        original(callData, ...args)
                        if (callData.state == "resolved") {
                            return callData.value
                        } else if (callData.state == "rejected") {
                            throw callData.value
                        }
                        return new Promise((resolve, reject) => {
                            promiseResolve = resolve
                            promiseReject = reject
                        })
                    }
                `]
            }
            let argsInfo: { argKey: string, needsTransform: boolean }[] = []
            const transformedMethod: StandardMethodTypes = {
                ...node.value,
                key: `__slightning_coco_widget_transformed_callback_function_to_code_blocks__${node.value.key}`,
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
                if (!methodParamNeedsTransformToCodeBlocks(part)) {
                    argsInfo.push({ argKey: part.key, needsTransform: false })
                    continue
                }
                const key = `${transformedMethod.key}${capitalize(part.key)}`
                const label = `${transformedMethod.label}·${part.label}`
                const type: FunctionType<unknown[], unknown> = part.type
                const newType = new FunctionType({
                    block: type.block,
                    defaultValue: type.defaultValue
                })
                transformedMethod.block[i] = {
                    key: `__slightning_coco_widget_transformed_callback_function_to_code_blocks__${part.key}`,
                    label: part.label,
                    type: newType
                }
                type callData = {
                    state: "undone" | "resolved" | "rejected"
                    value?: unknown
                    resolve(value: unknown): void
                    reject(reason: unknown): void
                }
                const callDataType: ObjectType<callData> = new ObjectType<callData>({
                    propertiesType: {
                        state: new StringEnumType([
                            ["未完成", "undone" ],
                            ["已解决", "resolved" ],
                            ["已拒绝", "rejected" ]
                        ]),
                        resolve: new FunctionType({
                            block: [["value", "值", type.returns ?? new VoidType()]]
                        }),
                        reject: new FunctionType({
                            block: [["reason", "原因", type.throws ?? new VoidType()]]
                        })
                    },
                    defaultValue: label
                })
                newType.block.unshift({
                    key: "__slightning_coco_widget_call_data__",
                    label: part.label,
                    type: callDataType
                })
                argsInfo.push({ argKey: part.key, needsTransform: true })
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
                                label: label,
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
                    addMethods[`__slightning_coco_widget_throw__${key}`] = {
                        args: ["callData", "exception", "callData.reject(exception)"]
                    }
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
                            }, "返回", ...type.returns.isVoid() ? [] : [{
                                key: "returnValue",
                                label: "返回值",
                                type: type.returns
                            }]
                        ],
                        returns: new VoidType(),
                        blockOptions: {
                            ...transformedMethod.blockOptions,
                            inline: true,
                            previousStatement: true,
                            nextStatement: false
                        }
                    })
                    addMethods[`__slightning_coco_widget_return__${key}`] = {
                        args: ["callData", "returnValue", "callData.resolve(returnValue)"]
                    }
                }
            }
            addMethods[transformedMethod.key] = {
                args: [
                    ...argsInfo.map((info): string => `_${info.argKey}`),
                    `return this.${node.value.key}(${
                        argsInfo.map((info): string => {
                            if (info.needsTransform) {
                                return `this.__slightning_coco_widget_transformed_callback_function_to_codeblocks_transform_argument__(_${info.argKey})`
                            } else {
                                return `_${info.argKey}`
                            }
                        }).join(",")
                    })`
                ]
            }
            node.insertAfter(transformedMethod)
        }
    })
    recordDecoratorOperation(widget, { add: { methods: addMethods } })
    return [types, widget]
}
