import * as CoCo from "../../coco"
import { capitalize } from "../../utils"
import { BlockBoxOptionsNode, EventTypesNode, MethodGroupNode, MethodTypesNode, PropertyGroupNode, PropertyTypesNode, traverseTypes } from "../decorators"
import { VoidType } from "../type"
import { Color, StandardEventParamTypes, StandardEventSubType, StandardEventTypes, MethodBlockParam, MethodParamTypes, StandardTypes, StandardMethodBlock } from "../types"
import { eventKeyMap } from "../utils"
import { Widget } from "../widget"

export function convertToCoCo(
    types: StandardTypes,
    widget: Widget
): [CoCo.Types, new (props: Record<string, any>) => CoCo.Widget] {
    return [typesToCoCo(types), new Proxy(widget, {
        construct(target: Widget, argArray: [Record<string, any>], newTarget: Function): CoCo.Widget {
            const [props] = argArray
            const widgetInstance: CoCo.Widget = Reflect.construct(target, argArray, newTarget)
            for (const [key, value] of Object.entries(props)) {
                Object.defineProperty(widgetInstance, key, {
                    value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                })
            }
            return widgetInstance
        }
    }) as new (props: Record<string, any>) => CoCo.Widget]
}

export function typesToCoCo(types: StandardTypes): CoCo.Types {
    const result: CoCo.Types = {
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
        properties: [],
        methods: [],
        events: []
    }
    const labels: string[] = []
    let showLine: boolean | string = false
    let addSpace: boolean = false
    let last: CoCo.PropertyTypes | CoCo.MethodTypes | CoCo.EventTypes | null = null
    let count: number = 0
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
            if (addSpace) {
                if (last != null) {
                    last.blockOptions ??= {}
                    last.blockOptions.space = 40
                }
                addSpace = false
            }
            result.properties.push(last = {
                key: node.value.key,
                label: node.value.label,
                ...node.value.type.toCoCoPropertyValueTypes(),
                blockOptions: {
                    getter: {
                        generateBlock: node.blockOptions.get != false
                    },
                    setter: {
                        generateBlock: node.blockOptions.set != false
                    },
                    line: typeof showLine == "string" ? showLine : showLine ? labels.join("·") : undefined
                }
            })
            showLine = false
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
            if (addSpace) {
                if (last != null) {
                    last.blockOptions ??= {}
                    last.blockOptions.space = 40
                }
                addSpace = false
            }
            if (node.value.throws != null && !(node.value.throws instanceof VoidType)) {
                throw new Error(`无法将方法 ${node.value.label} 的抛出类型转为 CoCo 类型`)
            }
            const deprecated: boolean | string = node.value.deprecated ?? node.blockOptions.deprecated ?? false
            const transformed: CoCo.MethodTypes = {
                key: node.value.key,
                params: [],
                ...node.value.returns?.toCoCoMethodValueTypes(),
                tooltip: node.value.tooltip ?? undefined,
                blockOptions: {
                    callMethodLabel: false,
                    line: typeof showLine == "string" ? showLine : showLine ? labels.join("·") : undefined,
                    order: ++count,
                    icon: node.blockOptions.icon ?? undefined,
                    color: deprecated ? Color.GREY : node.blockOptions.color ?? undefined,
                    inputsInline: node.blockOptions.inline ?? undefined
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
            transformed.blockOptions ??= {}
            if (node.blockOptions.inline ?? true) {
                let restParts: StandardMethodBlock | null = null
                let labelsBeforeThis: string[] = []
                if (deprecated != false) {
                    labelsBeforeThis.push("[已弃用]")
                }
                if (!node.value.block.includes(MethodBlockParam.THIS)) {
                    throw new Error(`方法 ${node.value.label} 缺少 this 参数`)
                }
                for (let i: number = 0; i < node.value.block.length; i++) {
                    const part: string | MethodBlockParam | MethodParamTypes | undefined = node.value.block[i]
                    if (part == MethodBlockParam.METHOD) {
                        labelsBeforeThis.push(node.value.label)
                    } else if (part == MethodBlockParam.THIS) {
                        restParts = node.value.block.slice(i + 1)
                        break
                    } else if (typeof part == "string") {
                        labelsBeforeThis.push(part)
                    } else if (part != undefined) {
                        throw new Error(`方法 ${node.value.label} 的积木 this 参数前存在他参数，不能将其转为 CoCo 类型`)
                    }
                }
                if (restParts == null) {
                    throw new Error(`方法 ${node.value.label} 缺少 this 参数`)
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
                        throw new Error(`方法只能有一个 this 参数，而方法 ${node.value.label} 有多个 this 参数`)
                    } else if (part == MethodBlockParam.METHOD) {
                        addText(node.value.label)
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
                if (deprecated != false) {
                    transformed.blockOptions.callMethodLabel = "[已弃用]"
                }
                transformed.blockOptions.inputsInline = false
                transformed.label = node.value.label
                for (const part of node.value.block) {
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
            showLine = false
            last = transformed
            result.methods.push(transformed)
        },
        EventTypes(node: EventTypesNode): void {
            if (addSpace) {
                if (last != null) {
                    last.blockOptions ??= {}
                    last.blockOptions.space = 40
                }
                addSpace = false
            }
            const deprecated: boolean | string = node.value.deprecated ?? node.blockOptions.deprecated ?? false
            const transformed: CoCo.EventTypes = {
                key: node.value.key,
                subTypes: node.value.subTypes ?? undefined,
                label: deprecated != false ? `[已弃用] ${node.value.label}` : node.value.label,
                params: node.value.params.map((param: StandardEventParamTypes): CoCo.EventParamTypes => {
                    return {
                        key: param.key,
                        label: param.label,
                        ...param.type.toCoCoEventParamValueTypes()
                    }
                }),
                tooltip: node.value.tooltip ?? undefined,
                blockOptions: {
                    line: typeof showLine == "string" ? showLine : showLine ? labels.join("·") : undefined,
                    order: ++count,
                    icon: node.blockOptions.icon ?? undefined
                }
            }
            if (node.value.subTypes != null) {
                addEventSubTypesMap(node.value.subTypes, 0, [node.value.key], [node.value.key], [node.value.label], node.value)
            }
            if (typeof deprecated == "string") {
                if (transformed.tooltip == null) {
                    transformed.tooltip = `${deprecated}`
                } else {
                    transformed.tooltip = `${deprecated}\n\n${transformed.tooltip}`
                }
            } else if (deprecated) {
                if (transformed.tooltip == null) {
                    transformed.tooltip = `该事件已弃用，并且可能在未来版本中移除，请尽快迁移到其他事件`
                } else {
                    transformed.tooltip = `该事件已弃用，并且可能在未来版本中移除，请尽快迁移到其他事件\n\n${transformed.tooltip}`
                }
            }
            showLine = false
            last = transformed
            result.events.push(transformed)
        },
        BlockBoxOptions(node: BlockBoxOptionsNode): void {
            if (node.value.space !=  null && last != null) {
                last.blockOptions ??= {}
                last.blockOptions.space = node.value.space
            }
            if (node.value.line != null) {
                showLine = node.value.line
            }
        }
    })
    return result
}

function addEventSubTypesMap(
    subTypes: StandardEventSubType[],
    i: number,
    keys: string[],
    capitalizedKeys: string[],
    labels: string[],
    event: StandardEventTypes
): void {
    if (i >= subTypes.length) {
        eventKeyMap[capitalizedKeys.join("")] = keys.join("")
        return
    }
    const subType: StandardEventSubType | undefined = subTypes[i]
    if (subType == undefined) {
        addEventSubTypesMap(subTypes, i + 1, keys, capitalizedKeys, labels, event)
        return
    }
    for (const item of subType.dropdown) {
        addEventSubTypesMap(
            subTypes, i + 1, [...keys, item.value], [...capitalizedKeys, capitalize(item.value)], [...labels, item.label], event
        )
    }
}
