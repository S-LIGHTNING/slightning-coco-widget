import { BUILD_IN_ICON_URL_MAP, MethodsTypes, PropertiesTypes, Types } from "../types"
import { Widget } from "../widget"

export function transformIconsExceptWidgetIcon(types: Types, widget: Widget): [Types, Widget] {
    typesTransformIcons(types)
    return [types, widget]
}

function typesTransformIcons(types: Types): void {
    propertiesTypesTransformIcon(types.properties)
    methodsTypesTransformIcon(types.methods)
}

function propertiesTypesTransformIcon(properties: PropertiesTypes): void {
    for (const property of properties) {
        if (
            property.blockOptions?.get != null &&
            typeof property.blockOptions?.get == "object"
        ) {
            transformIcon(property.blockOptions.get)
        }
        if (
            property.blockOptions?.set != null &&
            typeof property.blockOptions?.set == "object"
        ) {
            transformIcon(property.blockOptions.set)
        }
        if ("contents" in property) {
            propertiesTypesTransformIcon(property.contents)
        }
    }
}

function methodsTypesTransformIcon(methods: MethodsTypes): void {
    for (const method of methods) {
        if (method.blockOptions != null) {
            transformIcon(method.blockOptions)
        }
        if ("contents" in method) {
            methodsTypesTransformIcon(method.contents)
        }
    }
}

function transformIcon(object: { icon?: string | null | undefined }): void {
    if (object.icon != null) {
        object.icon = BUILD_IN_ICON_URL_MAP[object.icon] ?? object.icon
    }
}
