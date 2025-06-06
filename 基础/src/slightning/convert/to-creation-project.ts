import * as CreationProject from "../../creation-project"
import { BlockBoxOptionsNode, EventTypesNode, MethodGroupNode, MethodTypesNode, PropertyGroupNode, PropertyTypesNode, traverseTypes } from "../decorators"
import { IntegerType, MutatorType, NumberType, VoidType } from "../type"
import { Color, StandardEventParamTypes, MethodBlockParam, StandardTypes, StandardMethodBlockItem } from "../types"
import { Widget } from "../widget"

export function convertToCreationProject(
    types: StandardTypes,
    widget: Widget
): [CreationProject.Types, new (props: Record<string, any>) => CreationProject.widgetClass] {
    return [typesToCreationProject(types), widget as new (props: Record<string, any>) => CreationProject.widgetClass]
}

export function typesToCreationProject(types: StandardTypes): CreationProject.Types {
    const defaultPropertiesValues: {
        width?: number | undefined
        height?: number | undefined
    } = {}
    const result: CreationProject.Types = {
        type: types.type,
        label: types.info.title,
        icon: types.info.icon,
        category: types.info.category ?? undefined,
        visibleWidget: types.options.visible,
        global: types.options.global,
        default: defaultPropertiesValues,
        props: [],
        methods: [],
        emits: []
    }
    const labels: string[] = []
    let showLine: boolean | string = false
    let addSpace: boolean | number = false
    traverseTypes(types, {
        PropertyGroup: {
            entry(node: PropertyGroupNode): void {
                if (node.value.label != null) {
                    labels.push(node.value.label)
                    showLine = true
                }
                addSpace = true
            },
            exit(node: PropertyGroupNode): void {
                if (node.value.label != null) {
                    labels.pop()
                    showLine = true
                }
                addSpace = true
            }
        },
        PropertyTypes(node: PropertyTypesNode): void {
            if (node.value.key == "__width" && (node.value.type instanceof IntegerType || node.value.type instanceof NumberType)) {
                defaultPropertiesValues.width = node.value.type.defaultValue
            } else if (node.value.key == "__height" && (node.value.type instanceof IntegerType || node.value.type instanceof NumberType)) {
                defaultPropertiesValues.height = node.value.type.defaultValue
            } else {
                result.props.push({
                    key: node.value.key,
                    label: node.value.label,
                    ...node.value.type.toCreationProjectPropValueTypes(),
                    noBlock: ((): boolean => {
                        if ((node.value.blockOptions?.get ?? true == true) && (node.value.blockOptions?.set ?? true == true)) {
                            return false
                        } else if (node.value.blockOptions?.get == false && node.value.blockOptions.set == false) {
                            return true
                        } else {
                            throw new Error(`无法将属性 ${node.value.label} 转为 Creation Project 类型`)
                        }
                    })()
                })
            }
        },
        MethodGroup: {
            entry(node: MethodGroupNode): void {
                if (node.value.label != null) {
                    labels.push(node.value.label)
                    showLine = true
                }
                addSpace = true
            },
            exit(node: MethodGroupNode): void {
                if (node.value.label != null) {
                    labels.pop()
                    showLine = true
                }
                addSpace = true
            }
        },
        MethodTypes(node: MethodTypesNode): void {
            if (node.value.throws != null && !(node.value.throws instanceof VoidType)) {
                throw new Error(`无法将方法 ${node.value.label} 的抛出类型转为 Creation Project 类型`)
            }
            const deprecated: boolean | string = node.value.deprecated ?? node.blockOptions.deprecated ?? false
            const transformed: CreationProject.MethodTypes = {
                key: node.value.key,
                tipBefore: "",
                tipAfter: "",
                params: [],
                ...node.value.returns?.toCreationProjectMethodValueTypes(),
                tooltip: node.value.tooltip ?? undefined,
                color: deprecated ? Color.GREY : node.blockOptions.color ?? undefined,
                flyoutOptions: {
                    line: typeof showLine == "string" ? showLine : showLine ? labels.join("·") : undefined
                }
            }
            if (typeof deprecated == "string") {
                if (transformed.tooltip == null) {
                    transformed.tooltip = `${deprecated}`
                } else {
                    transformed.tooltip = `${deprecated}\n\n${transformed.tooltip}`
                }
            } else if (deprecated) {
                if (transformed.tooltip == null) {
                    transformed.tooltip = `该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法`
                } else {
                    transformed.tooltip = `该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法\n\n${transformed.tooltip}`
                }
            }
            if (node.blockOptions.inline ?? true) {
                let lastParam: CreationProject.MethodParamTypes | null = null
                let labelsAfterLastParam: string[] = []
                function addText(text: string): void {
                    if (lastParam == null) {
                        labelsAfterLastParam.push(text)
                    } else {
                        if (lastParam.label == null) {
                            lastParam.label = text
                        } else {
                            lastParam.label += " " + text
                        }
                    }
                }
                let i: number = node.value.block.length - 1
                for (; i >= 0; i--) {
                    const part: StandardMethodBlockItem | undefined = node.value.block[i]
                    if (part == undefined) {
                        continue
                    }
                    if (part == MethodBlockParam.THIS) {
                        break
                    } else if (part == MethodBlockParam.METHOD) {
                        addText(node.value.label)
                    } else if (typeof part == "string") {
                        addText(part)
                    } else {
                        lastParam = {
                            key: part.key,
                            ...part.type.toCreationProjectMethodParamValueTypes()
                        }
                        if (labelsAfterLastParam.length > 0) {
                            lastParam.labelAfter = labelsAfterLastParam.join(" ")
                            labelsAfterLastParam = []
                        }
                        transformed.params.unshift(lastParam)
                    }
                }
                if (node.value.block[i] != MethodBlockParam.THIS) {
                    throw new Error(`方法 ${node.value.label} 缺少 this 参数`)
                }
                i--
                let labelsBeforeThis: string[] = []
                for (; i >= 0; i--) {
                    const part: StandardMethodBlockItem | undefined = node.value.block[i]
                    if (part == undefined) {
                        continue
                    }
                    if (part == MethodBlockParam.THIS) {
                        throw new Error(`方法只能有一个 this 参数，而方法 ${node.value.label} 有多个 this 参数`)
                    } else if (part == MethodBlockParam.METHOD) {
                        labelsBeforeThis.unshift(node.value.label)
                    } else if (typeof part == "string") {
                        labelsBeforeThis.unshift(part)
                    } else {
                        throw new Error(`方法 ${node.value.label} 的积木 this 参数前存在他参数，不能将其转为 Creation Project 类型`)
                    }
                }
                if (deprecated != false) {
                    labelsBeforeThis.unshift("[已弃用]")
                }
                transformed.tipBefore = labelsBeforeThis.join(" ")
            } else {
                if (deprecated != false) {
                    transformed.tipBefore = "[已弃用]"
                }
                transformed.label = node.value.label
                for (const part of node.value.block) {
                    if (typeof part != "object") {
                        continue
                    }
                    if (part.type instanceof MutatorType) {
                        const mutatorValueType: CreationProject.MutatorTypes = part.type.toCreationProjectMethodParamValueTypes()
                        for (const mutatorParam of mutatorValueType.mutator ?? []) {
                            mutatorParam.label = `\n${mutatorParam.label ?? ""}`
                        }
                        transformed.params.push({
                            key: part.key,
                            ...mutatorValueType
                        })
                    } else {
                        transformed.params.push({
                            key: part.key,
                            label: `\n${part.label}`,
                            ...part.type.toCreationProjectMethodParamValueTypes()
                        })
                    }
                }
            }
            if (addSpace != false) {
                transformed.flyoutOptions ??= {}
                transformed.flyoutOptions.gap = typeof addSpace == "number" ? addSpace : 40
                addSpace = false
            }
            showLine = false
            result.methods.push(transformed)
        },
        EventTypes(node: EventTypesNode): void {
            if (node.value.subTypes != null) {
                throw new Error("无法将事件的子类型转为 Creation Project 类型")
            }
            const deprecated: boolean | string = node.value.deprecated ?? node.blockOptions.deprecated ?? false
            result.emits.push({
                key: node.value.key,
                label: deprecated != false ? `[已弃用] ${node.value.label}` : node.value.label,
                params: node.value.params.map((param: StandardEventParamTypes): CreationProject.EmitParamTypes => {
                    return {
                        key: param.key,
                        label: param.label,
                        ...param.type.toCreationProjectEmitParamValueTypes()
                    }
                })
            })
        },
        BlockBoxOptions(node: BlockBoxOptionsNode): void {
            if (node.value.space !=  null) {
                addSpace = node.value.space
            }
            if (node.value.line != null) {
                showLine = node.value.line
            }
        }
    })
    return result
}
