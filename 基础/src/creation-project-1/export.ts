import { Types } from "./type"
import { widgetClass } from "./widget"

declare const __slightning_coco_widget_exports__: {
    type?: Types,
    widget?: new (props: object) => widgetClass
}

export const widgetExports: typeof __slightning_coco_widget_exports__ = __slightning_coco_widget_exports__

export function exportWidget(types: Types, widget: new (props: object) => widgetClass): void {
    widgetExports.type = types
    widgetExports.widget = widget
}
