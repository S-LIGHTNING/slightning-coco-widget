import { StandardTypes } from "../types"
import { Widget } from "../widget"

export type Decorator = (types: StandardTypes, widget: Widget) => [StandardTypes, Widget]
