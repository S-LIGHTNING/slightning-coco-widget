import { defineMethod } from "../../../utils"
import { Widget } from "../../widget"

export interface RuntimeData {
    methods: {
        key: string
        successIndex: number
        errorIndex: number
    }[]
}

export function runtimeAddTransformMethodsThrows(data: RuntimeData, widget: Widget): Widget {
    for (const method of data.methods) {
        const { key, successIndex, errorIndex } = method
        defineMethod(widget.prototype, getNewMethodKey(key), function (this: any, ...args: unknown[]): void {
            const errorCallback = args.splice(errorIndex, 1)[0] as (error: unknown) => void
            const successCallback = args.splice(successIndex, 1)[0] as (...args: unknown[]) => void
            try {
                const result: unknown = this[method.key].apply(this, args)
                if (result instanceof Promise) {
                    result.then(successCallback)
                    result.catch(errorCallback)
                } else {
                    successCallback(result)
                }
            } catch (error) {
                errorCallback(error)
            }
        })
    }
    return widget
}

export function getNewMethodKey(key: string): string {
    return `__slightning_coco_widget_transformed_throws__${key}`
}
