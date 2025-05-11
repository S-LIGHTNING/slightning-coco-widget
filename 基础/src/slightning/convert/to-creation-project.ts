import * as CreationProject from "../../creation-project"
import { merge } from "../../utils"
import { IntegerType, NumberType, VoidType } from "../type"
import { Color, EventParamTypes, EventTypes, MethodBlockOptionsTypes, MethodBlockParam, MethodParamTypes, MethodsTypes, PropertiesTypes, Types } from "../types"
import { Widget } from "../widget"

export function convertToCreationProject(
    types: Types,
    widget: Widget
): [CreationProject.Types, new (props: Record<string, any>) => CreationProject.widgetClass] {
    return [typesToCreationProject(types), widget as new (props: Record<string, any>) => CreationProject.widgetClass]
}

export function typesToCreationProject(types: Types): CreationProject.Types {
    const defaultPropertiesValues: {
        width?: number | undefined
        height?: number | undefined
    } = {}
    return {
        type: types.type,
        label: types.info.title,
        icon: types.info.icon,
        category: types.info.category ?? undefined,
        visibleWidget: types.options.visible,
        global: types.options.global,
        default: defaultPropertiesValues,
        props: convertPropertiesTypesToCreationProject(defaultPropertiesValues, types.properties),
        methods: convertMethodsTypesToCreationProject(types.methods),
        emits: convertEventsTypesToCreationProject(types.events)
    }
}

export function convertPropertiesTypesToCreationProject(
    defaultPropertiesValues: {
        width?: number | undefined
        height?: number | undefined
    },
    properties: PropertiesTypes
): CreationProject.PropTypes[] {
    const result: CreationProject.PropTypes[] = []

    function add(properties: PropertiesTypes): void {
        for (const property of properties) {
            if ("contents" in property) {
                add(property.contents)
                continue
            }
            if (property.blockOptions?.get != null && typeof property.blockOptions.get == "object") {
                throw new Error(`无法将属性 ${property.label} 的取值函数转为 Creation Project 类型`)
            }
            if (property.blockOptions?.set != null && typeof property.blockOptions.set == "object") {
                throw new Error(`无法将属性 ${property.label} 的赋值函数转为 Creation Project 类型`)
            }
            if (property.key == "__width" && (property.type instanceof IntegerType || property.type instanceof NumberType)) {
                defaultPropertiesValues.width = property.type.defaultValue
            } else if (property.key == "__height" && (property.type instanceof IntegerType || property.type instanceof NumberType)) {
                defaultPropertiesValues.height = property.type.defaultValue
            } else {
                result.push({
                    key: property.key,
                    label: property.label,
                    ...property.type.toCreationProjectPropValueTypes(),
                    noBlock: ((): boolean => {
                        if (property.blockOptions?.get == null && property.blockOptions?.set == null) {
                            return false
                        } else if (property.blockOptions?.get == false && property.blockOptions.set == false) {
                            return true
                        } else {
                            throw new Error(`无法将属性 ${property.label} 转为 Creation Project 类型`)
                        }
                    })()
                })
            }
        }
    }

    add(properties)

    return result
}

export function convertMethodsTypesToCreationProject(methods: MethodsTypes): CreationProject.MethodTypes[] {

    const result: CreationProject.MethodTypes[] = []

    let lastMethod: CreationProject.MethodTypes | null = null
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
                throw new Error(`无法将方法 ${method.label} 的抛出类型转为 Creation Project 类型`)
            }
            const blockOptions: MethodBlockOptionsTypes = merge(
                {}, groupBlockOptions, method.blockOptions ?? {}
            )
            const transformed: CreationProject.MethodTypes = {
                key: method.key,
                tipBefore: "",
                tipAfter: "",
                params: [],
                ...method.returns?.toCreationProjectMethodValueTypes(),
                tooltip: method.tooltip ?? undefined,
                color: blockOptions.deprecated ? Color.GREY : blockOptions.color ?? undefined
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
                        throw new Error(`方法 ${method.label} 的积木 this 参数前存在他参数，不能将其转为 Creation Project 类型`)
                    }
                }
                if (restParts == null) {
                    throw new Error(`方法 ${method.label} 缺少 this 参数`)
                }
                if (labelsBeforeThis.length != 0) {
                    transformed.tipBefore = labelsBeforeThis.join(" ")
                }
                let lastParam: CreationProject.MethodParamTypes | null = null
                function addText(text: string): void {
                    if (lastParam == null) {
                        if (transformed.label == null) {
                            transformed.label = text
                        } else {
                            transformed.label += " " + text
                        }
                    } else {
                        if (lastParam.labelAfter == null) {
                            lastParam.labelAfter = text
                        } else {
                            lastParam.labelAfter += " " + text
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
                            ...part.type.toCreationProjectMethodParamValueTypes()
                        }
                        transformed.params.push(lastParam)
                    }
                }
            } else {
                if (blockOptions.deprecated != null) {
                    transformed.tipBefore = "[已弃用]"
                }
                transformed.label = method.label
                for (const part of method.block) {
                    if (typeof part != "object") {
                        continue
                    }
                    transformed.params.push({
                        key: part.key,
                        label: `\n${part.label}`,
                        ...part.type.toCreationProjectMethodParamValueTypes()
                    })
                }
            }
            if (isFirst) {
                isFirst = false
                transformed.flyoutOptions ??= {}
                if (showGroupLabel) {
                    showGroupLabel = false
                    transformed.flyoutOptions.line = labels.join("·")
                }
                if (lastMethod != null) {
                    transformed.flyoutOptions.gap = 40
                }
            }
            lastMethod = transformed
            result.push(transformed)
        }
    }

    add(methods)

    return result
}

export function convertEventsTypesToCreationProject(events: EventTypes[]): CreationProject.EmitTypes[] {
    const result: CreationProject.EmitTypes[] = []
    for (const event of events) {
        if (event.subTypes != null) {
            throw new Error("无法将事件的子类型转为 Creation Project 类型")
        }
        result.push({
            key: event.key,
            label: event.label,
            params: event.params.map((param: EventParamTypes): CreationProject.EmitParamTypes => {
                return {
                    key: param.key,
                    label: param.label,
                    ...param.type.toCreationProjectEmitParamValueTypes()
                }
            })
        })
    }
    return result
}
