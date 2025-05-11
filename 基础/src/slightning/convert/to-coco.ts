import * as CoCo from "../../coco"
import { merge } from "../../utils"
import { VoidType } from "../type"
import { Color, EventParamTypes, EventTypes, MethodBlockOptionsTypes, MethodBlockParam, MethodParamTypes, MethodsTypes, PropertiesTypes, Types } from "../types"
import { Widget } from "../widget"

export function convertToCoCo(
    types: Types,
    widget: Widget
): [CoCo.Types, new (props: Record<string, any>) => CoCo.Widget] {
    return [typesToCoCo(types), widget as new (props: Record<string, any>) => CoCo.Widget]
}

export function typesToCoCo(types: Types): CoCo.Types {
    return {
        type: types.type,
        title: types.info.title,
        icon: types.info.icon,
        version: types.info.version ?? undefined,
        docs: {
            url: types.info.url?.docs ?? undefined
        },
        isInvisibleWidget: !types.options.visible,
        isGlobalWidget: types.options.global,
        platforms: types.options.platforms ?? undefined,
        hasAnyWidget: types.options.any ?? undefined,
        properties: convertPropertiesTypesToCoCo(types.properties),
        methods: convertMethodsTypesToCoCo(types.methods),
        events: convertEventsTypesToCoCo(types.events)
    }
}

export function convertPropertiesTypesToCoCo(properties: PropertiesTypes): CoCo.PropertyTypes[] {

    const result: CoCo.PropertyTypes[] = []

    function add(properties: PropertiesTypes): void {
        for (const property of properties) {
            if ("contents" in property) {
                add(property.contents)
                continue
            }
            if (property.blockOptions?.get != null && typeof property.blockOptions.get == "object") {
                throw new Error(`无法将属性 ${property.label} 的取值函数转为 CoCo 类型`)
            }
            if (property.blockOptions?.set != null && typeof property.blockOptions.set == "object") {
                throw new Error(`无法将属性 ${property.label} 的赋值函数转为 CoCo 类型`)
            }
            result.push({
                key: property.key,
                label: property.label,
                ...property.type.toCoCoPropertyValueTypes(),
                blockOptions: {
                    getter: {
                        generateBlock: property.blockOptions?.get ?? true
                    },
                    setter: {
                        generateBlock: property.blockOptions?.set ?? true
                    }
                }
            })
        }
    }

    add(properties)

    return result
}

export function convertMethodsTypesToCoCo(methods: MethodsTypes): CoCo.MethodTypes[] {

    const result: CoCo.MethodTypes[] = []

    let lastMethod: CoCo.MethodTypes | null = null
    let showGroupLabel: boolean = false

    function add(
        methods: MethodsTypes,
        labels: string[] = [],
        groupBlockOptions: MethodBlockOptionsTypes = {}
    ): void {
        let isFirst: boolean = true
        for (const method of methods) {
            if ("contents" in method) {
                if (method.label == null) {
                    add(
                        method.contents,
                        labels,
                        merge({}, groupBlockOptions, method.blockOptions ?? {})
                    )
                } else {
                    showGroupLabel = true
                    add(
                        method.contents,
                        [...labels, method.label],
                        merge({}, groupBlockOptions, method.blockOptions ?? {})
                    )
                    showGroupLabel = true
                }
                isFirst = true
                continue
            }
            if (method.throws != null && !(method.throws instanceof VoidType)) {
                throw new Error(`无法将方法 ${method.label} 的抛出类型转为 CoCo 类型`)
            }
            const blockOptions: MethodBlockOptionsTypes = merge(
                {}, groupBlockOptions, method.blockOptions ?? {}
            )
            const transformed: CoCo.MethodTypes = {
                key: method.key,
                params: [],
                ...method.returns?.toCoCoMethodValueTypes(),
                tooltip: method.tooltip ?? undefined,
                blockOptions: {
                    callMethodLabel: false,
                    icon: blockOptions.icon ?? undefined,
                    color: blockOptions.deprecated ? Color.GREY : blockOptions.color ?? undefined,
                    inputsInline: blockOptions.inline ?? undefined
                }
            }
            if (typeof blockOptions.deprecated == "string") {
                if (transformed.tooltip == null) {
                    transformed.tooltip = `该方法已弃用：${blockOptions.deprecated}`
                } else {
                    transformed.tooltip = `${transformed.tooltip}\n\n该方法已弃用：${blockOptions.deprecated}`
                }
            } else if (blockOptions.deprecated) {
                if (transformed.tooltip == null) {
                    transformed.tooltip = `该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法`
                } else {
                    transformed.tooltip = `${transformed.tooltip}\n\n该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法`
                }
            }
            transformed.blockOptions ??= {}
            if (blockOptions.inline ?? true) {
                let restParts: (string | MethodBlockParam | MethodParamTypes)[] | null = null
                let labelsBeforeThis: string[] = []
                if (blockOptions.deprecated != null) {
                    labelsBeforeThis.push("[已弃用]")
                }
                if (!method.block.includes(MethodBlockParam.THIS)) {
                    throw new Error(`方法 ${method.label} 缺少 this 参数`)
                }
                for (let i: number = 0; i < method.block.length; i++) {
                    const part: string | MethodBlockParam | MethodParamTypes | undefined = method.block[i]
                    if (part == MethodBlockParam.METHOD) {
                        labelsBeforeThis.push(method.label)
                    } else if (part == MethodBlockParam.THIS) {
                        restParts = method.block.slice(i + 1)
                        break
                    } else if (typeof part == "string") {
                        labelsBeforeThis.push(part)
                    } else if (part != undefined) {
                        throw new Error(`方法 ${method.label} 的积木 this 参数前存在他参数，不能将其转为 CoCo 类型`)
                    }
                }
                if (restParts == null) {
                    throw new Error(`方法 ${method.label} 缺少 this 参数`)
                }
                if (labelsBeforeThis.length != 0) {
                    transformed.blockOptions.callMethodLabel = labelsBeforeThis.join(" ")
                }
                let lastParam: CoCo.MethodParamTypes | null = null
                function addText(text: string): void {
                    if (lastParam == null) {
                        if (transformed.label == null) {
                            transformed.label = text
                        } else {
                            transformed.label = `${transformed.label} ${text}`
                        }
                    } else {
                        if (lastParam.labelAfter == null) {
                            lastParam.labelAfter = text
                        } else {
                            lastParam.labelAfter = `${lastParam.labelAfter} ${text}`
                        }
                    }
                }
                for (const part of restParts) {
                    if (part == MethodBlockParam.THIS) {
                        throw new Error(`方法只能有一个 this 参数，而方法 ${method.label} 有多个 this 参数`)
                    } else if (part == MethodBlockParam.METHOD) {
                        addText(method.label)
                    } else if (typeof part == "string") {
                        addText(part)
                    } else {
                        lastParam = {
                            key: part.key,
                            ...part.type.toCoCoMethodParamValueTypes()
                        }
                        transformed.params.push(lastParam)

                    }
                }
            } else {
                if (blockOptions.deprecated != null) {
                    transformed.blockOptions.callMethodLabel = "[已弃用]"
                }
                transformed.blockOptions.inputsInline = false
                transformed.label = method.label
                for (const part of method.block) {
                    if (typeof part != "object") {
                        continue
                    }
                    transformed.params.push({
                        key: part.key,
                        label: part.label,
                        ...part.type.toCoCoMethodParamValueTypes()
                    })
                }
            }
            if (isFirst) {
                isFirst = false
                if (showGroupLabel) {
                    showGroupLabel = false
                    transformed.blockOptions.line = labels.join("·")
                }
                if (lastMethod != null) {
                    lastMethod.blockOptions ??= {}
                    lastMethod.blockOptions.space = 40
                }
            }
            lastMethod = transformed
            result.push(transformed)
        }
    }

    add(methods)

    return result
}

export function convertEventsTypesToCoCo(events: EventTypes[]): CoCo.EventTypes[] {
    return events.map((event: EventTypes): CoCo.EventTypes => ({
        key: event.key,
        subTypes: event.subTypes ?? undefined,
        label: event.label,
        params: event.params.map((param: EventParamTypes): CoCo.EventParamTypes => {
            return {
                key: param.key,
                label: param.label,
                ...param.type.toCoCoEventParamValueTypes()
            }
        })
    }))
}
