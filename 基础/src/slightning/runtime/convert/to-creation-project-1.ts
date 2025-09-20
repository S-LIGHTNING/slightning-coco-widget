import * as CreationProject1 from "../../../creation-project-1"
import { Widget } from "../../widget"

export function widgetToCreationProject1(widget: Widget): new (props: Record<string, any>) => CreationProject1.widgetClass {
    return widget as new (props: Record<string, any>) => CreationProject1.widgetClass
}
