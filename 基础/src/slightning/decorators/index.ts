import { StandardTypes } from "../types"
import { Widget } from "../widget"

export type Decorator = (types: StandardTypes, widget: Widget) => [StandardTypes, Widget]

export * from "./transform-methods-throws"
export * from "./add-transform-methods-throws"
export * from "./generate-method-for-functions"
export * from "./transform-methods-callback-functions-to-events"
export * from "./add-transform-methods-callback-functions-to-events"
export * from "./transform-methods-callback-functions-to-code-blocks"
export * from "./add-transform-methods-callback-functions-to-code-blocks"
export * from "./add-this-for-methods"
export * from "./generate-block-for-properties"
export * from "./flatten-event-sub-types"
export * from "./add-flatten-event-sub-types"
export * from "./transform-icons-except-widget-icon"
export * from "./transform-icons"
export * from "./add-check"

export * from "./utils"
