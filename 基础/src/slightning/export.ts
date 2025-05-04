import { Adapter, getDefaultAdapter } from "./adapters/adapter"
import { Decorator } from "./decorators"
import { Types } from "./types"
import { Widget } from "./widget"

export interface ExportConfig {
    decorators?: Decorator[] | null | undefined
    CoCo?: {
        decorators?: Decorator[] | null | undefined
    } | null | undefined
    CreationProject?: {
        decorators?: Decorator[] | null | undefined
    } | null | undefined
}

export function exportWidget(
    types: Types,
    widget: Widget,
    config?: ExportConfig | null | undefined
): void {
    const adapter: Adapter = getDefaultAdapter()
    const decorators: Decorator[] = [
        ...config?.decorators ?? []
    ]
    for (const decorator of decorators) {
        [types, widget] = decorator(types, widget)
    }
    adapter.exportWidget(types, widget, config)
}
