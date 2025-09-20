import { Widget } from "../../widget"
import { RuntimeDecorator } from "./types"

export function warpDecoratorWithRuntimeData(
    runtimeData: unknown,
    decorator: (runtimeData: unknown, widget: Widget) => Widget
): RuntimeDecorator {
    return function (widget: Widget): Widget {
        return decorator(runtimeData, widget)
    }
}
