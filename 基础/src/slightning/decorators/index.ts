import { Types } from "../types"
import { Widget } from "../widget"

export type Decorator = (types: Types, widget: Widget) => [Types, Widget]

export * from "./transform-methods-throws"
export * from "./generate-method-for-functions"
export * from "./transform-methods-callback-functions-to-events"
export * from "./transform-methods-callback-functions-to-code-blocks"
export * from "./add-this-for-methods"
export * from "./generate-block-for-properties"
export * from "./flatten-event-sub-types"
export * from "./transform-icons-except-widget-icon"
export * from "./transform-icons"
export * from "./add-check"
