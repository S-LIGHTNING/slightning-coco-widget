import { getNewMethodKey, runtimeAddTransformMethodsThrows, RuntimeData } from "../runtime/decorators/add-transform-methods-throws"
import { FunctionType } from "../type"
import { MethodBlockParam, MethodParamTypes, StandardMethodTypes, StandardTypes } from "../types"
import { Widget } from "../widget"
import { MethodTypesNode, recordDecoratorOperation, traverseTypes } from "./utils"

export function addTransformMethodsThrows(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    const runtimeData: RuntimeData = { methods: [] }
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            const { value: method } = node
            if (method.throws == null || method.throws.isVoid()) {
                return
            }
            const newMethod: StandardMethodTypes = {
                ...method,
                key: getNewMethodKey(method.key),
                block: [...method.block],
                returns: null,
                throws: null
            }
            const successIndex: number = newMethod.block.filter(
                (part: string | MethodBlockParam | MethodParamTypes): boolean => typeof part == "object"
            ).length
            newMethod.block.push("成功则", {
                key: "__slightning_coco_widget_success_callback__",
                label: "成功回调",
                type: new FunctionType({
                    block: method.returns == null || method.returns.isVoid()? [] : [{
                        key: "value",
                        label: "值",
                        type: method.returns
                    }]
                })
            })
            const errorIndex: number = newMethod.block.filter(
                (part: string | MethodBlockParam | MethodParamTypes): boolean => typeof part == "object"
            ).length
            newMethod.block.push("失败则", {
                key: "__slightning_coco_widget_error_callback__",
                label: "失败回调",
                type: new FunctionType({
                    block: [{
                        key: "error",
                        label: "错误",
                        type: method.throws
                    }]
                })
            })
            node.insertAfter(newMethod)
            runtimeData.methods.push({ key: method.key, successIndex, errorIndex })
        }
    })
    recordDecoratorOperation(widget, {
        runtime: {
            func: "runtimeAddTransformMethodsThrows",
            data: runtimeData
        }
    })
    runtimeAddTransformMethodsThrows(runtimeData, widget)
    return [types, widget]
}
