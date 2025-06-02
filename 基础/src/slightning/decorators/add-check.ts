import React from "react"
import { addMessageToError, betterToString, errorToArray } from "../../utils"
import { StringEnumType, TypeValidateError, validate } from "../type"
import { MethodBlockOptions, MethodBlockParam, StandardMethodTypes, StandardTypes } from "../types"
import { Logger } from "../utils"
import { getSuperWidget, Widget } from "../widget"
import { MethodTypesNode, traverseTypes } from "./utils"

export function addCheck(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    const methodsMap: Record<string, {
        types: StandardMethodTypes
        blockOptions: MethodBlockOptions
    }> = {}
    traverseTypes(types, {
        MethodTypes(node: MethodTypesNode): void {
            methodsMap[node.value.key] = {
                types: node.value,
                blockOptions: node.blockOptions
            }
        }
    })
    return [types, new Proxy(widget, {
        construct(target: Widget, argArray: any[], newTarget: Function): object {
            let widget: any, logger: Logger
            try {
                widget = Reflect.construct(target, argArray, newTarget)
                logger = new Logger(types, widget)
            } catch (error) {
                widget = new (class ConstructErrorWidget extends getSuperWidget(types) {
                    public constructor(props: object) {
                        super(props)
                        logger = new Logger(types, this)
                        const newError: unknown = addMessageToError("控件构造失败", error)
                        logger.error(...errorToArray(newError))
                        for (const methodKey of Object.keys(methodsMap)) {
                            // @ts-ignore
                            this[methodKey] = function (): void {
                                throw newError
                            }
                        }
                        if (types.options.visible) {
                            // @ts-ignore
                            this.render = function (): void {
                                throw newError
                            }
                        }
                    }
                })(argArray[0])
            }
            return new Proxy(widget, {
                get(target: any, p: string | symbol, receiver: any): any {
                    const originalFunction: unknown = Reflect.get(target, p, receiver)
                    if (typeof p == "string" && p in methodsMap) {
                        const method: {
                            types: StandardMethodTypes
                            blockOptions: MethodBlockOptions
                        } = methodsMap[p]!
                        let newFunction: Function
                        if (typeof originalFunction == "function") {
                            newFunction = originalFunction
                        } else if (!(p in target)) {
                            newFunction = function (): void {
                                throw new Error(`该方法（key: ${p}）在控件实体定义中不存在`)
                            }
                        } else {
                            newFunction = function (): void {
                                throw new Error(`该方法在控件实体定义中为 ${betterToString(originalFunction)}，不是函数`)
                            }
                        }
                        return new Proxy(newFunction, {
                            apply(target: Function, thisArg: any, argArray: any[]): any {
                                let __description: unknown[] | null = null
                                function getDescription(): unknown[] {
                                    if (__description == null) {
                                        __description = []
                                        if (method.blockOptions.inline ?? true) {
                                            let i: number = 0
                                            for (const part of method.types.block) {
                                                if (part == MethodBlockParam.THIS) {
                                                    continue
                                                } else if (part == MethodBlockParam.METHOD) {
                                                    __description.push(method.types.label)
                                                    continue
                                                } else if (typeof part == "string") {
                                                    __description.push(part)
                                                    continue
                                                } else if (part.type instanceof StringEnumType) {
                                                    const label: string | undefined = part.type.valueToLabelMap[argArray[i]]
                                                    if (label != undefined) {
                                                        __description.push(`[${label}]`)
                                                    } else {
                                                        __description.push(argArray[i])
                                                    }
                                                } else if (typeof argArray[i] == "string") {
                                                    __description.push(JSON.stringify(argArray[i]))
                                                } else {
                                                    __description.push(argArray[i])
                                                }
                                                i++
                                            }
                                        } else {
                                            __description.push(method.types.label)
                                            let i: number = 0
                                            for (const part of method.types.block) {
                                                if (part == MethodBlockParam.THIS) {
                                                    continue
                                                } else if (part == MethodBlockParam.METHOD) {
                                                    __description.push(method.types.label)
                                                    continue
                                                } else if (typeof part == "string") {
                                                    continue
                                                } else if (part.type instanceof StringEnumType) {
                                                    const label: string | undefined = part.type.valueToLabelMap[argArray[i]]
                                                    if (label != undefined) {
                                                        __description.push(`[${label}]`)
                                                    } else {
                                                        __description.push(argArray[i])
                                                    }
                                                } else if (typeof argArray[i] == "string") {
                                                    __description.push(JSON.stringify(argArray[i]))
                                                } else {
                                                    __description.push(argArray[i])
                                                }
                                                i++
                                            }
                                        }
                                    }
                                    return __description
                                }
                                if (typeof method.blockOptions.deprecated == "string") {
                                    logger.warn(...getDescription(), "该方法已弃用：", method.blockOptions.deprecated)
                                } else if (method.blockOptions.deprecated) {
                                    logger.warn(...getDescription(), "该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法")
                                }
                                const errors: TypeValidateError<unknown>[] = []
                                let i: number = 0
                                for (const part of method.types.block) {
                                    if (typeof part != "object") {
                                        continue
                                    }
                                    try {
                                        validate(part.label, argArray[i], part.type)
                                    } catch (error) {
                                        if (!(error instanceof TypeValidateError)) {
                                            throw error
                                        }
                                        errors.push(error)
                                    }
                                    i++
                                }
                                if (errors.length != 0) {
                                    logger.error(...getDescription(), "类型验证失败：", ...errors.map(
                                        (error: TypeValidateError<unknown>):  string => `\n　${error.message}`
                                    ))
                                }
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
                    } else if (types.options.visible && p == "render") {
                        let newFunction: Function
                        if (typeof originalFunction == "function") {
                            newFunction = originalFunction
                        } else if (!(p in target)) {
                            newFunction = function (): void {
                                throw new Error(`渲染方法在控件实体定义中不存在`)
                            }
                        } else {
                            newFunction = function (): void {
                                throw new Error(`渲染方法在控件实体定义中为 ${betterToString(originalFunction)}，不是函数`)
                            }
                        }
                        return new Proxy(newFunction, {
                            apply(target: Function, thisArg: any, argArray: any[]): any {
                                try {
                                    return Reflect.apply(target, thisArg, argArray)
                                } catch (error) {
                                    logger.error("渲染", "出错：", ...errorToArray(error))
                                    return React.createElement("div", {
                                        style: {
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "#FFFFFF80",
                                            overflow: "auto"
                                        }
                                    }, React.createElement("div", {
                                        style: {
                                            width: "max-content",
                                            color: "#C00000",
                                            fontSize: "2em",
                                            fontWeight: "bold",
                                            fontFamily: "monospace",
                                        }
                                    }, "渲染出错：", betterToString(error).split("\n").map(
                                        (line: string): React.ReactNode => ([
                                            line, React.createElement("br")
                                        ])
                                    )))
                                }
                            }
                        })
                    }
                    return originalFunction
                }
            })
        }
    })]
}
