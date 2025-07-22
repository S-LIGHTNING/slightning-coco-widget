import { Adapter, getDefaultAdapter } from "./adapters/adapter"
import { standardizeTypes } from "./convert/standardize-types"
import { Decorator } from "./decorators"
import { StandardTypes, Types } from "./types"
import { Widget } from "./widget"

type Platform = "CoCo" | "CreationProject" | "NodeJS"

type Platforms =
    "CoCo" |
    "CreationProject" |
    "Node" |
    "CoCo|CreationProject" |
    "CoCo|NodeJS" |
    "CreationProject|NodeJS" |
    "CoCo|CreationProject|NodeJS"

export interface ExportConfig {
    decorators?: (
        Decorator |
        Partial<Record<Platforms, Decorator | Decorator[] | null | undefined>>
    )[] | null | undefined
    CoCo?: {
        decorators?: Decorator[] | null | undefined
    } | null | undefined
    CreationProject?: {
        decorators?: Decorator[] | null | undefined
    } | null | undefined
    NodeJS?: {
        decorators?: Decorator[] | null | undefined
    } | null | undefined
}

export function decorate(
    types: StandardTypes,
    widget: Widget,
    config: ExportConfig | null | undefined,
    platform: Platform
): [StandardTypes, Widget] {
    for (const decorator of config?.decorators ?? []) {
        if (typeof decorator == "object") {
            for (const [platforms, platformDecorator] of Object.entries(decorator)) {
                if (
                    platformDecorator == null ||
                    !platforms.split("|").includes(platform)
                ) {
                    continue
                }
                if (Array.isArray(platformDecorator)) {
                    for (const decorator of platformDecorator) {
                        [types, widget] = decorator(types, widget)
                    }
                } else {
                    [types, widget] = platformDecorator(types, widget)
                }
            }
        } else {
            [types, widget] = decorator(types, widget)
        }
    }
    for (const decorator of config?.[platform]?.decorators ?? []) {
        [types, widget] = decorator(types, widget)
    }
    return [types, widget]
}

export function exportWidget(
    types: Types,
    widget: Widget,
    config?: ExportConfig | null | undefined
): void {
    const adapter: Adapter = getDefaultAdapter()
    adapter.exportWidget(standardizeTypes(types), widget, config)
}
