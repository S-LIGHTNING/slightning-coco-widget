import { BUILD_IN_ICON_URL_MAP, StandardTypes } from "../types"
import { Widget } from "../widget"
import { transformIconsExceptWidgetIcon } from "./transform-icons-except-widget-icon"

export function transformIcons(types: StandardTypes, widget: Widget): [StandardTypes, Widget] {
    [types, widget] = transformIconsExceptWidgetIcon(types, widget)
    types.info.icon = types.info.icon = BUILD_IN_ICON_URL_MAP[types.info.icon] ?? types.info.icon
    return [types, widget]
}
