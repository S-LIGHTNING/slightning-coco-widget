import React from "react"

import { addMessageToError, betterToString, defineMethod, errorToArray, HTMLEscape, loadStringify } from "../../../utils"
import { Widget } from "../../widget"
import { RuntimeType, TypeValidateError, validate } from "../type"
import { RuntimeStringEnumType } from "../type/string-enum-type"
import { RuntimeLogger } from "../utils/logger"
import { runtimeGetSuperWidget } from "../widget"

export interface RuntimeData {
    widgetTitle: string
    isVisibleWidget: boolean
    methodsMap: Record<string, {
        label: string
        texts: string[]
        params: RuntimeParamData[]
        deprecated?: boolean | string | null | undefined
    }>
}

export interface RuntimeParamData {
    label: string
    type: RuntimeType
}

export function runtimeAddCheck(data: RuntimeData, widget: Widget): Widget {
    let isFirstRenderError: boolean = true
    return new Proxy(widget, {
        construct(target: Widget, argArray: any[], newTarget: Function): object {
            let widget: any, logger: RuntimeLogger
            try {
                widget = Reflect.construct(target, argArray, newTarget)
                logger = new RuntimeLogger(data, widget)
            } catch (error) {
                widget = new (class ConstructErrorWidget extends runtimeGetSuperWidget({ isVisibleWidget: data.isVisibleWidget, propertiesName: [] }) {
                    public constructor(props: object) {
                        super(props)
                        logger = new RuntimeLogger(data, this)
                        const newError: unknown = addMessageToError("控件构造失败", error)
                        logger.error(...errorToArray(newError))
                        for (const methodKey of Object.keys(data.methodsMap)) {
                            defineMethod(this, methodKey, () => { throw newError })
                        }
                        if (data.isVisibleWidget) {
                            defineMethod(this, "render", () => { throw newError })
                        }
                    }
                })(argArray[0])
            }
            return new Proxy(widget, {
                get(target: any, p: string | symbol, receiver: any): any {
                    const originalFunction: unknown = Reflect.get(target, p, receiver)
                    if (typeof p == "string" && Object.prototype.hasOwnProperty.call(data.methodsMap, p)) {
                        const { params, texts, deprecated } = data.methodsMap[p]!
                        let newFunction: Function
                        if (typeof originalFunction == "function") {
                            newFunction = originalFunction
                        } else if (!(p in target)) {
                            newFunction = () => {
                                throw new Error(`该方法（key: ${p}）在控件实体定义中不存在`)
                            }
                        } else {
                            newFunction = () => {
                                throw new Error(`该方法在控件实体定义中为 ${betterToString(originalFunction)}，不是函数`)
                            }
                        }
                        return new Proxy(newFunction, {
                            apply(target: Function, thisArg: any, argArray: any[]): any {
                                let __description: unknown[] | null = null
                                function getDescription(): unknown[] {
                                    if (__description == null) {
                                        __description = []
                                        for (let i = 0; i < texts.length; i++) {
                                            __description.push(texts[i])
                                            const { type } = params[i] ?? {}
                                            if (type == undefined) {
                                                continue
                                            }
                                            if (type instanceof RuntimeStringEnumType) {
                                                const label = type.valueToLabelMap[argArray[i]]
                                                __description.push(label == undefined ? argArray[i] : `[${label}]`)
                                            } else {
                                                __description.push(typeof argArray[i] == "string" ? JSON.stringify(argArray[i]) : argArray[i])
                                            }
                                        }
                                    }
                                    return __description
                                }
                                if (typeof deprecated == "string") {
                                    logger.warn(...getDescription(), "该方法已弃用：" + deprecated)
                                } else if (deprecated) {
                                    logger.warn(...getDescription(), "该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法")
                                }
                                ;(async () => {
                                    await loadStringify()
                                    const errors: TypeValidateError<unknown>[] = []
                                    let i: number = 0
                                    for (const param of params) {
                                        try {
                                            validate(param.label, argArray[i], param.type)
                                        } catch (error) {
                                            if (!(error instanceof TypeValidateError)) {
                                                throw error
                                            }
                                            errors.push(error)
                                        }
                                        i++
                                    }
                                    if (errors.length != 0) {
                                        logger.error(...getDescription(), "类型验证失败：" + errors.map(
                                            (error: TypeValidateError<unknown>):  string => `\n　${error.message.split("\n").join("\n　")}`
                                        ).join(""))
                                    }
                                })()
                                try {
                                    const returnValue: unknown = Reflect.apply(target, thisArg, argArray)
                                    if (returnValue instanceof Promise) {
                                        return returnValue.catch((error: unknown): void => {
                                            logger.error(...getDescription(), "出错：", ...errorToArray(error))
                                        })
                                    } else {
                                        return returnValue
                                    }
                                } catch (error) {
                                    logger.error(...getDescription(), "出错：", ...errorToArray(error))
                                }
                            }
                        })
                    } else if (data.isVisibleWidget && p == "render") {
                        let newFunction: Function
                        if (typeof originalFunction == "function") {
                            newFunction = originalFunction
                        } else if (!(p in target)) {
                            newFunction = () => {
                                throw new Error(`渲染方法在控件实体定义中不存在`)
                            }
                        } else {
                            newFunction = () => {
                                throw loadStringify().then(() => Promise.reject(
                                    new Error(`渲染方法在控件实体定义中为 ${betterToString(originalFunction)}，不是函数`)
                                ))
                            }
                        }
                        return new Proxy(newFunction, {
                            apply(target: Function, thisArg: any, argArray: any[]): any {
                                try {
                                    return Reflect.apply(target, thisArg, argArray)
                                } catch (error) {
                                    if (isFirstRenderError) {
                                        logger.error("渲染", "出错：", ...errorToArray(error))
                                        isFirstRenderError = false
                                    }
                                    return React.createElement("div", {
                                        style: {
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "#FFFFFF80",
                                            overflow: "auto"
                                        }
                                    }, React.createElement("div", {
                                        async ref(instance: HTMLElement): Promise<void> {
                                            await loadStringify()
                                            instance.innerHTML = "渲染出错：" + HTMLEscape(betterToString(await error))
                                        },
                                        style: {
                                            width: "max-content",
                                            color: "#C00000",
                                            fontSize: "2em",
                                            fontWeight: "bold",
                                            fontFamily: "monospace",
                                        }
                                    }, "渲染出错，错误信息格式化程序正在加载中……"))
                                }
                            }
                        })
                    }
                    return originalFunction
                }
            })
        }
    })
}
