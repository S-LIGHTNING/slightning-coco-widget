import { excludeBoolean } from "../../utils"
import { StandardTypes } from "../types"
import { Widget } from "../widget"
import { EventTypesNode, MethodGroupNode, MethodTypesNode, PropertyGroupNode, PropertyTypesNode, transformIcon, traverseTypes } from "./utils"

export function transformIconsExceptWidgetIcon(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    traverseTypes(types, {
        PropertyGroup(node: PropertyGroupNode): void {
            transformIcon(excludeBoolean(node.value.blockOptions?.get))
            transformIcon(excludeBoolean(node.value.blockOptions?.set))
        },
        PropertyTypes(node: PropertyTypesNode): void {
            transformIcon(excludeBoolean(node.value.blockOptions?.get))
            transformIcon(excludeBoolean(node.value.blockOptions?.set))
        },
        MethodGroup(node: MethodGroupNode): void {
            transformIcon(node.value.blockOptions)
        },
        MethodTypes(node: MethodTypesNode): void {
            transformIcon(node.value.blockOptions)
        },
        EventTypes(node: EventTypesNode): void {
            transformIcon(node.value.blockOptions)
        }
    })
    return [types, widget]
}