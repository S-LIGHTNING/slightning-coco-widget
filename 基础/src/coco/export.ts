import { Widget } from "./widget"
import { Types } from "./types"

declare const __slightning_coco_widget_exports__: {
    types?: Types,
    widget?: new (props: object) => Widget
}

export const widgetExports: typeof __slightning_coco_widget_exports__ = __slightning_coco_widget_exports__

export function exportWidget(types: Types, widget: new (props: object) => Widget): void {
    widgetExports.types = types
    widgetExports.widget = widget
}
