import { capitalize } from "../../utils"
import { RuntimeData, getNewMethodKey, getReturnMethodKey, getThrowMethodKey, CallData, RuntimeMethodParam, runtimeAddTransformMethodsCallbackFunctionsToEvents } from "../runtime/decorators/add-transform-methods-callback-functions-to-events"
import { AnyType, FunctionType, ObjectType, StringEnumType, VoidType } from "../type"
import { StandardEventParamTypes, MethodBlockParam, MethodParamTypes, StandardMethodTypes, StandardTypes, BlockType } from "../types"
import { Widget } from "../widget"
import { methodParamNeedsTransformToEvent, MethodTypesNode, recordDecoratorOperation, traverseTypes } from "./utils"

export function addTransformMethodsCallbackFunctionsToEvents(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    const runtimeData: RuntimeData = {
        transform: []
    }
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            const { value: method } = node
            if (!method.block.some(methodParamNeedsTransformToEvent)) {
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
                if (!methodParamNeedsTransformToEvent(param)) {
                    runtimeParams.push(null)
                    continue
                }
                const runtimeParam: RuntimeMethodParam = { key: param.key }
                const fullParamKey = `${newMethodKey}${capitalize(param.key)}`
                const fullParamLabel = `${newMethod.label}·${param.label}`
                const paramType = param.type
                const callDataType: ObjectType<CallData> = new ObjectType<CallData>({
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
                const eventParams: StandardEventParamTypes[] = [
                    {
                        key: "__slightning_coco_widget_call_data__",
                        label: param.label,
                        type: callDataType
                    }, {
                        key: "__slightning_coco_widget_call_context__",
                        label: "上下文",
                        type: new AnyType()
                    }
                ]
                for (const part of paramType.block) {
                    if (typeof part != "object") {
                        continue
                    }
                    eventParams.push({
                        key: part.key,
                        label: part.label,
                        type: part.type
                    })
                }
                newMethod.block.splice(i, 1, param.label, "（上下文", {
                    key: `__slightning_coco_widget_call_context__${param.key}`,
                    label: `${param.label}（上下文）`,
                    type: new AnyType({
                        defaultValue: `${param.label}上下文`
                    })
                }, "）")
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
                node.insertAfter({
                    type: BlockType.EVENT,
                    key: fullParamKey,
                    label: `${fullParamLabel}被调用`,
                    params: eventParams
                })
                runtimeParams.push(runtimeParam)
            }
            node.insertAfter(newMethod)
            runtimeData.transform.push({ key: method.key, params: runtimeParams })
        }
    })
    recordDecoratorOperation(widget, {
        runtime: {
            func: "runtimeAddTransformMethodsCallbackFunctionsToEvents",
            data: runtimeData
        }
    })
    runtimeAddTransformMethodsCallbackFunctionsToEvents(runtimeData, widget)
    return [types, widget]
}
