import { capitalize, defineMethod } from "../../../utils"
import { Widget } from "../../widget"
import { emit } from "../utils"

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

export function runtimeAddTransformMethodsCallbackFunctionsToEvents(data: RuntimeData, widget: Widget): Widget {
    const { prototype } = widget
    for (const method of data.transform) {
        const newMethodKey = getNewMethodKey(method.key)
        const eventsKey: (string | null | undefined)[] = []
        for (const param of method.params) {
            if (param == null) {
                eventsKey.push(null)
                continue
            }
            const fullParamKey = `${newMethodKey}${capitalize(param.key)}`
            eventsKey.push(fullParamKey)
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
                for (let i = 0; i < eventsKey.length; i++) {
                    const { [i]: eventKey } = eventsKey
                    if (eventKey != null) {
                        args[i] = transformArg.call(this, eventKey, args[i])
                    }
                }
                return this[method.key].apply(this, args)
            }
        )
    }
    return widget
}

export function getNewMethodKey(key: string): string {
    return `__slightning_coco_widget_transformed_callback_function_to_events__${key}`
}

export function getReturnMethodKey(fullParamKey: string): string {
    return `__slightning_coco_widget_return__${fullParamKey}`
}

export function getThrowMethodKey(fullParamKay: string): string {
    return `__slightning_coco_widget_throw__${fullParamKay}`
}

function transformArg(this: {}, eventKey: string, context: unknown): unknown {
    const widget = this
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
        emit.call(widget, eventKey, callData, context, ...args)
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
