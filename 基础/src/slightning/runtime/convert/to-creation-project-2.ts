import * as CreationProject2 from "../../../creation-project-2"
import { Widget } from "../../widget"

export function widgetToCreationProject2(widget: Widget): new (props: Record<string, any>) => CreationProject2.widgetClass {
    return widget as new (props: Record<string, any>) => CreationProject2.widgetClass
}
