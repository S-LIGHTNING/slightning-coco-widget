import { ExportConfig } from "../export"
import { StandardTypes, Types } from "../types"
import { Utils } from "../utils/utils"
import { Widget } from "../widget"

export interface Adapter {
    getSuperWidget(types: Types): Widget,
    exportWidget(types: StandardTypes, widget: Widget, config?: ExportConfig | null | undefined): void
    emit(this: {}, key: string, ...args: unknown[]): void
    Logger: new (types: Types, widget: {}) => LoggerAdapter
    utils: Utils
}

export interface LoggerAdapter {
    log(this: this, message: string): void
    info(this: this, message: string): void
    warn(this: this, message: string): void
    error(this: this, message: string): void
}

let defaultAdapter: Adapter | null = null

export function getDefaultAdapter(): Adapter {
    if (defaultAdapter == null) {
        throw new Error("未设置默认适配器")
    }
    return defaultAdapter
}

export function setDefaultAdapter(adapter: Adapter): void {
    defaultAdapter = adapter
}
