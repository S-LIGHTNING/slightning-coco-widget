import * as CoCo from "../../../coco"
import { defineProperty } from "../../../utils"
import { Widget } from "../../widget"

export function widgetToCoCo(widget: Widget): new (props: Record<string, any>) => CoCo.Widget {
    return new Proxy(widget, {
        construct(target: Widget, argArray: [Record<string, any>], newTarget: Function): CoCo.Widget {
            const [props] = argArray
            const widgetInstance: CoCo.Widget = Reflect.construct(target, argArray, newTarget)
            for (const [key, value] of Object.entries(props)) {
                defineProperty(widgetInstance, key, value)
            }
            return widgetInstance
        }
    }) as new (props: Record<string, any>) => CoCo.Widget
}
