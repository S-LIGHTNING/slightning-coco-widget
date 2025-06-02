import { capitalize, excludeBoolean } from "../../utils"
import { VoidType } from "../type/void-type"
import { BlockType, BUILD_IN_PROPERTIES, Color, MethodBlockParam, StandardMethodGroup, StandardTypes } from "../types"
import { Widget } from "../widget"
import { PropertyGroupNode, PropertyTypesNode, traverseTypes } from "./utils"

export function generateBlockForProperties(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {

    const gettersGroup: StandardMethodGroup = {
        label: "获取",
        contents: []
    }
    const setterGroup: StandardMethodGroup = {
        label: "设置",
        contents: []
    }
    const propertyBlockGroup: StandardMethodGroup = {
        label: "属性",
        blockOptions: {
            color: Color.PINK
        },
        contents: [gettersGroup, setterGroup]
    }

    let currentGettersGroup: StandardMethodGroup = gettersGroup
    let gettersGroupStack: StandardMethodGroup[] = []
    let currentSettersGroup: StandardMethodGroup = setterGroup
    let settersGroupStack: StandardMethodGroup[] = []

    traverseTypes(types, {
        PropertyGroup: {
            entry(node: PropertyGroupNode): void {
                gettersGroupStack.push(currentGettersGroup)
                currentGettersGroup = {
                    label: node.value.label,
                    blockOptions: excludeBoolean(node.value.blockOptions?.get),
                    contents: []
                }
                settersGroupStack.push(currentSettersGroup)
                currentSettersGroup = {
                    label: node.value.label,
                    blockOptions: excludeBoolean(node.value.blockOptions?.set),
                    contents: []
                }
            },
            exit(): void {
                currentGettersGroup = gettersGroupStack.pop()!
                currentSettersGroup = settersGroupStack.pop()!
            }
        },
        PropertyTypes(node: PropertyTypesNode): void {
            if (BUILD_IN_PROPERTIES.includes(node.value.key)) {
                return
            }
            if (node.blockOptions?.get != false) {
                const propertyGetBlockKey: string =
                    excludeBoolean(node.blockOptions?.get)?.key ?? `get${capitalize(node.value.key)}`
                currentGettersGroup.contents.push({
                    type: BlockType.METHOD,
                    key: propertyGetBlockKey,
                    label: `获取 ${node.value.label}`,
                    block: [
                        MethodBlockParam.THIS, node.value.label
                    ],
                    returns: node.value.type,
                    blockOptions: excludeBoolean(node.value.blockOptions?.get)
                })
                if (widget.prototype[propertyGetBlockKey] == null) {
                    Object.defineProperty(widget.prototype, propertyGetBlockKey, {
                        value: function (): unknown {
                            return this[node.value.key]
                        },
                        writable: true,
                        enumerable: false,
                        configurable: true
                    })
                }
            }
            if (node.blockOptions?.set != false) {
                const propertySetBlockKey: string =
                    excludeBoolean(node.blockOptions?.set)?.key ?? `set${capitalize(node.value.key)}`
                currentSettersGroup.contents.push({
                    type: BlockType.METHOD,
                    key: propertySetBlockKey,
                    label: `设置 ${node.value.label}`,
                    block: [
                        "设置", MethodBlockParam.THIS, "的", node.value.label, "为", {
                            key: "value",
                            label: node.value.label,
                            type: node.value.type
                        }
                    ],
                    returns: new VoidType(),
                    blockOptions: excludeBoolean(node.value.blockOptions?.set)
                })
                if (widget.prototype[propertySetBlockKey] == null) {
                    Object.defineProperty(widget.prototype, propertySetBlockKey, {
                        value: function (value: unknown): void {
                            this[node.value.key] = value
                        },
                        writable: true,
                        enumerable: false,
                        configurable: true
                    })
                }
            }
            node.value.blockOptions = {
                get: false,
                set: false
            }
        }
    })

    types.methods.push(propertyBlockGroup)

    return [types, widget]
}
