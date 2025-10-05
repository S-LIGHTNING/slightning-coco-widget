import { capitalize, defineMethod } from "../../../utils"
import { Widget } from "../../widget"

export interface RuntimeData {
    transform: RuntimeMethod[]
}

export interface RuntimeMethod {
    key: string
    params: (RuntimeMethodParam | null | undefined)[]
}

export interface RuntimeMethodParam {
    key: string
    returns?: boolean | null | undefined
    throws?: boolean | null | undefined
}

export interface CallData {
    state: "undone" | "resolved" | "rejected"
    value?: unknown
    resolve(value: unknown): void
    reject(reason: unknown): void
}

export function runtimeAddTransformMethodsCallbackFunctionsToCodeBlocks(data: RuntimeData, widget: Widget): Widget {
    const { prototype } = widget
    for (const method of data.transform) {
        const newMethodKey = getNewMethodKey(method.key)
        const { params } = method
        for (const param of params) {
            if (param == null) {
                continue
            }
            const fullParamKey = `${newMethodKey}${capitalize(param.key)}`
            if (param.returns) {
                defineMethod(prototype, getReturnMethodKey(fullParamKey),
                    function (callData: CallData, returnValue: unknown): void {
                        callData.resolve(returnValue)
                    }
                )
            }
            if (param.throws) {
                defineMethod(prototype, getThrowMethodKey(fullParamKey),
                    function (callData: CallData, exception: unknown): void {
                        callData.reject(exception)
                    }
                )
            }
        }
        defineMethod(prototype, newMethodKey,
            function (this: any, ...args: unknown[]): unknown {
                for (let i = 0; i < params.length; i++) {
                    if (params[i] != null) {
                        args[i] = transformArg(args[i])
                    }
                }
                return this[method.key].apply(this, args)
            }
        )
    }
    return widget
}

export function getNewMethodKey(key: string): string {
    return `__slightning_coco_widget_transformed_callback_function_to_code_blocks__${key}`
}

export function getReturnMethodKey(fullParamKey: string): string {
    return `__slightning_coco_widget_return__${fullParamKey}`
}

export function getThrowMethodKey(fullParamKay: string): string {
    return `__slightning_coco_widget_throw__${fullParamKay}`
}

function transformArg(original: unknown): unknown {
    if (typeof original != "function") {
        return original
    }
    return function (...args: unknown[]): unknown {
        let promiseResolve: ((value: unknown) => void) | null = null
        let promiseReject: ((reason?: unknown) => void) | null = null
        const callData = Object.create({
            state: "undone",
            resolve(result: unknown): void {
                if (callData.state == "undone") {
                    callData.state = "resolved"
                    callData.value = result
                    if (promiseResolve != null) {
                        promiseResolve(result)
                    }
                }
            },
            reject(reason: unknown): void {
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
}
