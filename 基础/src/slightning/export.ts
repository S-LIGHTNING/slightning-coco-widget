import { Adapter, getDefaultAdapter } from "./adapters/adapter"
import { standardizeTypes } from "./convert/standardize-types"
import { Decorator } from "./decorators"
import { StandardTypes, Types } from "./types"
import { Widget } from "./widget"

type Platform = "CoCo" | "CreationProject" | "CreationProject1" | "CreationProject2" | "NodeJS"

type Platforms =
    "CoCo" |
    "CreationProject" |
    "CreationProject1" |
    "CreationProject2" |
    "Node" |
    "CoCo|CreationProject" |
    "CoCo|CreationProject1" |
    "CoCo|CreationProject2" |
    "CoCo|NodeJS" |
    "CreationProject|NodeJS" |
    "CreationProject1|CreationProject2" |
    "CreationProject1|NodeJS" |
    "CreationProject2|NodeJS" |
    "CoCo|CreationProject|NodeJS" |
    "CoCo|CreationProject1|CreationProject2" |
    "CoCo|CreationProject1|NodeJS" |
    "CoCo|CreationProject2|NodeJS" |
    "CreationProject1|CreationProject2|NodeJS" |
    "CoCo|CreationProject1|CreationProject2|NodeJS"

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
    CreationProject1?: {
        decorators?: null | undefined
    } | null | undefined
    CreationProject2?: {
        decorators?: null | undefined
    } | null | undefined
    NodeJS?: {
        decorators?: null | undefined
    } | null | undefined
}

export function decorate(
    types: StandardTypes,
    widget: Widget,
    config: ExportConfig | null | undefined,
    platforms: Platform[]
): [StandardTypes, Widget] {
    for (const decorator of config?.decorators ?? []) {
        if (typeof decorator == "object") {
            for (const [appliedPlatforms, platformDecorator] of Object.entries(decorator)) {
                if (
                    platformDecorator == null ||
                    appliedPlatforms.split("|").every(
                        (platform: string): boolean => !platforms.includes(platform as Platform)
                    )
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
    for (const platform of platforms) {
        for (const decorator of config?.[platform]?.decorators ?? []) {
            [types, widget] = decorator(types, widget)
        }
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
