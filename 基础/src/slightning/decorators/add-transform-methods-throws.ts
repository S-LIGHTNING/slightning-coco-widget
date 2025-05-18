import { FunctionType, VoidType } from "../type"
import { MethodBlockParam, MethodGroup, MethodParamTypes, MethodsTypes, MethodTypes, Types } from "../types"
import { Widget } from "../widget"

export function addTransformMethodsThrows(types: Types, widget: Widget): [Types, Widget] {
    methodsTransformThrows(types.methods, widget)
    return [types, widget]
}

function methodsTransformThrows(methods: MethodsTypes, widget: Widget): void {
    for (let i: number = methods.length - 1; i >= 0; i--) {
        const originalMethod: MethodGroup | MethodTypes | undefined = methods[i]
        if (originalMethod == undefined) {
            continue
        }
        if ("contents" in originalMethod) {
            methodsTransformThrows(originalMethod.contents, widget)
            continue
        }
        if (originalMethod.throws == null || originalMethod.throws instanceof VoidType) {
            continue
        }
        const transformedMethod: MethodTypes = {
            ...originalMethod,
            key: `__slightning_coco_widget_transformed_throws__${originalMethod.key}`,
            block: [...originalMethod.block],
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
                block: originalMethod.returns == null || originalMethod.returns instanceof VoidType? [] : [{
                    key: "value",
                    label: "值",
                    type: originalMethod.returns
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
                    type: originalMethod.throws
                }]
            })
        })
        methods.splice(i + 1, 0, transformedMethod)
        Object.defineProperty(widget.prototype, transformedMethod.key, {
            value: function (...args: unknown[]): void | Promise<void> {
                const errorCallback: (error: unknown) => void = args.splice(errorIndex, 1)[0] as (error: unknown) => void
                const successCallback: (...args: unknown[]) => void = args.splice(successIndex, 1)[0] as (...args: unknown[]) => void
                try {
                    const result: unknown = this[originalMethod.key].apply(this, args)
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
}
