import { Adapter, getDefaultAdapter } from "./adapters/adapter"
import { standardizeTypes } from "./convert/standardize-types"
import { Decorator } from "./decorators"
import { Types } from "./types"
import { Widget } from "./widget"

export interface ExportConfig {
    decorators?: (Decorator | {
        CoCo?: Decorator | null | undefined
        CreationProject?: Decorator | null | undefined
    })[] | null | undefined
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
    adapter.exportWidget(standardizeTypes(types), widget, config)
}
