import { capitalize } from "../../utils"
import { VoidType } from "../type/void-type"
import { BUILD_IN_PROPERTIES, Color, MethodBlockParam, MethodGroup, PropertiesTypes, Types } from "../types"
import { Widget } from "../widget"

export function generateBlockForProperties(types: Types, widget: Widget): [Types, Widget] {

    const gettersGroup: MethodGroup = {
        label: "获取",
        contents: []
    }
    const setterGroup: MethodGroup = {
        label: "设置",
        contents: []
    }
    const propertyBlockGroup: MethodGroup = {
        label: "属性",
        blockOptions: {
            color: Color.PINK
        },
        contents: [gettersGroup, setterGroup]
    }

    function addGetters(
        properties: PropertiesTypes,
        methodGroup: MethodGroup = gettersGroup
    ): void {
        for (const property of properties) {
            if (property.blockOptions?.get == false) {
                continue
            }
            if ("contents" in property) {
                addGetters(property.contents, {
                    label: property.label,
                    blockOptions: property.blockOptions?.get == true ? {} : property.blockOptions?.get,
                    contents: []
                })
                continue
            }
            if (BUILD_IN_PROPERTIES.includes(property.key)) {
                continue
            }
            const propertyGetBlockKey: string =
                typeof property.blockOptions?.get == "object" && property.blockOptions?.get?.key != null ?
                property.blockOptions?.get.key : `get${capitalize(property.key)}`
            methodGroup.contents.push({
                key: propertyGetBlockKey,
                label: `获取 ${property.label}`,
                block: [
                    MethodBlockParam.THIS, property.label
                ],
                returns: property.type,
                blockOptions: property.blockOptions?.get == true ? {} : property.blockOptions?.get
            })
            if (widget.prototype[propertyGetBlockKey] == null) {
                widget.prototype[propertyGetBlockKey] = function (): unknown {
                    return this[property.key]
                }
            }
            property.blockOptions ??= {}
            property.blockOptions.get = false
        }
    }

    function addSetters(
        properties: PropertiesTypes,
        methodGroup: MethodGroup = gettersGroup
    ): void {
        for (const property of properties) {
            if (property.blockOptions?.set == false) {
                continue
            }
            if ("contents" in property) {
                addSetters(property.contents, {
                    label: property.label,
                    blockOptions: property.blockOptions?.set == true ? {} : property.blockOptions?.set,
                    contents: []
                })
                continue
            }
            if (BUILD_IN_PROPERTIES.includes(property.key)) {
                continue
            }
            const propertySetBlockKey: string =
                typeof property.blockOptions?.set == "object" && property.blockOptions?.set?.key != null ?
                property.blockOptions?.set.key : `set${capitalize(property.key)}`
            methodGroup.contents.push({
                key: propertySetBlockKey,
                label: `设置 ${property.label}`,
                block: [
                    "设置", MethodBlockParam.THIS, "的", property.label, "为", {
                        key: "value",
                        label: property.label,
                        type: property.type
                    }
                ],
                returns: new VoidType(),
                blockOptions: property.blockOptions?.set == true ? {} : property.blockOptions?.set
            })
            if (widget.prototype[propertySetBlockKey] == null) {
                widget.prototype[propertySetBlockKey] = function (value: unknown): void {
                    this[property.key] = value
                }
            }
            property.blockOptions ??= {}
            property.blockOptions.set = false
        }
    }

    addGetters(types.properties, gettersGroup)
    addSetters(types.properties, setterGroup)
    types.methods.push(propertyBlockGroup)

    return [types, widget]
}
