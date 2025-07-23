import { FunctionType } from "../type"
import { MethodBlockParam, MethodParamTypes, StandardMethodTypes, StandardTypes } from "../types"
import { Widget } from "../widget"
import { MethodTypesNode, traverseTypes } from "./utils"

export function addTransformMethodsThrows(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            if (node.value.throws == null || node.value.throws.isVoid()) {
                return
            }
            const transformedMethod: StandardMethodTypes = {
                ...node.value,
                key: `__slightning_coco_widget_transformed_throws__${node.value.key}`,
                block: [...node.value.block],
                returns: null,
                throws: null
            }
            const successIndex: number = transformedMethod.block.filter(
                (part: string | MethodBlockParam | MethodParamTypes): boolean => typeof part == "object"
            ).length
            transformedMethod.block.push("成功则", {
                key: "__slightning_coco_widget_success_callback__",
                label: "成功回调",
                type: new FunctionType({
                    block: node.value.returns == null || node.value.returns.isVoid()? [] : [{
                        key: "value",
                        label: "值",
                        type: node.value.returns
                    }]
                })
            })
            const errorIndex: number = transformedMethod.block.filter(
                (part: string | MethodBlockParam | MethodParamTypes): boolean => typeof part == "object"
            ).length
            transformedMethod.block.push("失败则", {
                key: "__slightning_coco_widget_error_callback__",
                label: "失败回调",
                type: new FunctionType({
                    block: [{
                        key: "error",
                        label: "错误",
                        type: node.value.throws
                    }]
                })
            })
            node.insertAfter(transformedMethod)
            Object.defineProperty(widget.prototype, transformedMethod.key, {
                value: function (...args: unknown[]): void | Promise<void> {
                    const errorCallback: (error: unknown) => void = args.splice(errorIndex, 1)[0] as (error: unknown) => void
                    const successCallback: (...args: unknown[]) => void = args.splice(successIndex, 1)[0] as (...args: unknown[]) => void
                    try {
                        const result: unknown = this[node.value.key].apply(this, args)
                        if (result instanceof Promise) {
                            result.then(successCallback)
                            result.catch(errorCallback)
                        } else {
                            successCallback(result)
                        }
                    } catch (error) {
                        errorCallback(error)
                    }
                },
                writable: true,
                enumerable: false,
                configurable: true
            })
        }
    })
    return [types, widget]
}
