import { capitalize } from "../../utils"
import { CallData, getNewMethodKey, getReturnMethodKey, getThrowMethodKey, runtimeAddTransformMethodsCallbackFunctionsToCodeBlocks, RuntimeData, RuntimeMethodParam } from "../runtime/decorators/add-transform-methods-callback-functions-to-code-blocks"
import { FunctionType, ObjectType, StringEnumType, VoidType } from "../type"
import { BlockType, MethodBlockParam, MethodParamTypes, StandardMethodTypes, StandardTypes } from "../types"
import { Widget } from "../widget"
import { methodParamNeedsTransformToCodeBlocks, MethodTypesNode, recordDecoratorOperation, traverseTypes } from "./utils"

export function addTransformMethodsCallbackFunctionsToCodeBlocks(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    const runtimeData: RuntimeData = {
        transform: []
    }
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            const { value: method } = node
            if (!method.block.some(methodParamNeedsTransformToCodeBlocks)) {
                return
            }
            const runtimeParams: (RuntimeMethodParam | null | undefined)[] = []
            const newMethodKey = getNewMethodKey(method.key)
            const newMethod: StandardMethodTypes = {
                ...method,
                key: newMethodKey,
                block: [...method.block]
            }
            for (let i: number = 0; i < newMethod.block.length; i++) {
                const param: string | MethodBlockParam | MethodParamTypes | undefined = newMethod.block[i]
                if (param == undefined) {
                    continue
                }
                if (typeof param != "object") {
                    continue
                }
                if (!methodParamNeedsTransformToCodeBlocks(param)) {
                    runtimeParams.push(null)
                    continue
                }
                const runtimeParam: RuntimeMethodParam = { key: param.key }
                const fullParamKey = `${newMethodKey}${capitalize(param.key)}`
                const fullParamLabel = `${newMethod.label}·${param.label}`
                const paramType = param.type
                const newParamType = new FunctionType({
                    block: paramType.block,
                    defaultValue: paramType.defaultValue
                })
                const callDataType = new ObjectType<CallData>({
                    propertiesType: {
                        state: new StringEnumType([
                            ["未完成", "undone" ],
                            ["已解决", "resolved" ],
                            ["已拒绝", "rejected" ]
                        ]),
                        resolve: new FunctionType({
                            block: [["value", "值", paramType.returns ?? new VoidType()]]
                        }),
                        reject: new FunctionType({
                            block: [["reason", "原因", paramType.throws ?? new VoidType()]]
                        })
                    },
                    defaultValue: fullParamLabel
                })
                newMethod.block[i] = {
                    key: `__slightning_coco_widget_transformed_callback_function_to_code_blocks__${param.key}`,
                    label: param.label,
                    type: newParamType
                }
                newParamType.block.unshift({
                    key: "__slightning_coco_widget_call_data__",
                    label: param.label,
                    type: callDataType
                })
                i++
                if (paramType.throws != null && !(paramType.throws.isVoid())) {
                    runtimeParam.throws = true
                    const throwMethodKey = getThrowMethodKey(fullParamKey)
                    node.insertAfter({
                        space: 8
                    }, {
                        type: BlockType.METHOD,
                        key: throwMethodKey,
                        label: `${fullParamLabel}抛出`,
                        block: [
                            {
                                key: "__slightning_coco_widget_call_data__",
                                label: fullParamLabel,
                                type: callDataType
                            }, "抛出", {
                                key: "exception",
                                label: "异常",
                                type: paramType.throws
                            }
                        ],
                        returns: new VoidType(),
                        blockOptions: {
                            ...newMethod.blockOptions,
                            inline: true,
                            previousStatement: true,
                            nextStatement: false
                        }
                    })
                }
                if (paramType.returns != null) {
                    runtimeParam.returns = true
                    const returnMethodKey = getReturnMethodKey(fullParamKey)
                    node.insertAfter({
                        space: 8
                    }, {
                        type: BlockType.METHOD,
                        key: returnMethodKey,
                        label: `${fullParamLabel}返回`,
                        block: [
                            {
                                key: "__slightning_coco_widget_call_data__",
                                label: fullParamLabel,
                                type: callDataType
                            }, "返回", ...(paramType.returns.isVoid() ? [] : [{
                                key: "returnValue",
                                label: "返回值",
                                type: paramType.returns
                            }])
                        ],
                        returns: new VoidType(),
                        blockOptions: {
                            ...newMethod.blockOptions,
                            inline: true,
                            previousStatement: true,
                            nextStatement: false
                        }
                    })
                }
                runtimeParams.push(runtimeParam)
            }
            node.insertAfter(newMethod)
            runtimeData.transform.push({ key: method.key, params: runtimeParams })
        }
    })
    recordDecoratorOperation(widget, {
        runtime: {
            func: "runtimeAddTransformMethodsCallbackFunctionsToCodeBlocks",
            data: runtimeData
        }
    })
    runtimeAddTransformMethodsCallbackFunctionsToCodeBlocks(runtimeData, widget)
    return [types, widget]
}
