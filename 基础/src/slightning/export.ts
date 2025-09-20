import { crossPlatform } from "./runtime/cross-platform"
import { Decorator } from "./decorators"
import { StandardTypes, Types } from "./types"
import { Widget } from "./widget"
import { convertToCoCo, convertToCreationProject1, standardizeTypes, typesToCoCo, typesToCreationProject1, widgetToCoCo, widgetToCreationProject1 } from "./convert"
import * as CoCo from "../coco"
import * as CreationProject1 from "../creation-project-1"
import * as CreationProject2 from "../creation-project-2"
import { convertToCreationProject2, typesToCreationProject2, widgetToCreationProject2 } from "./convert/to-creation-project-2"
import { buildTimeRecordData } from "./build-time-convert"
import { RuntimeExportWidgetData } from "./runtime/export"
import { clone, UseDefaultClone } from "../utils"

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
    let standardTypes = standardizeTypes(types)
    if (global.__slightning_coco_widget_record_mode__) {
        const platform = global.__slightning_coco_widget_platform__
        if (platform != null && platform != "All") {
            const [types] = decorate(standardTypes, widget, config, {
                CoCo: ["CoCo"],
                CreationProject1: ["CreationProject", "CreationProject2"],
                CreationProject2: ["CreationProject", "CreationProject2"]
            }[platform] as Platform[])
            buildTimeRecordData({
                types: {
                    [platform]: {
                        CoCo: typesToCoCo,
                        CreationProject1: typesToCreationProject1,
                        CreationProject2: typesToCreationProject2
                    }[platform]!(types)
                }
            })
            ;(({ CoCo, CreationProject1, CreationProject2 })[platform] as any).widgetExports.widget = {
                CoCo: widgetToCoCo,
                CreationProject1: widgetToCreationProject1,
                CreationProject2: widgetToCreationProject2
            }[platform]!(widget)
        } else {
            const [CoCoTypes] = decorate(cloneTypes(standardTypes), widget, config, ["CoCo"])
            const [CreationProject1Types] = decorate(cloneTypes(standardTypes), widget, config, ["CreationProject", "CreationProject2"])
            const [CreationProject2Types] = decorate(cloneTypes(standardTypes), widget, config, ["CreationProject", "CreationProject2"])
            buildTimeRecordData({
                types: {
                    CoCo: typesToCoCo(CoCoTypes),
                    CreationProject1: typesToCreationProject1(CreationProject1Types),
                    CreationProject2: typesToCreationProject2(CreationProject2Types)
                }
            } satisfies RuntimeExportWidgetData)
            CoCo.widgetExports.widget = widgetToCoCo(widget)
            CreationProject1.widgetExports.widget = widgetToCreationProject1(widget)
            CreationProject2.widgetExports.widget = widgetToCreationProject2(widget)
        }
    } else {
        crossPlatform({
            CoCo(): void {
                [standardTypes, widget] = decorate(standardTypes, widget, config, ["CoCo"])
                CoCo.exportWidget(...convertToCoCo(standardTypes, widget))
            },
            CreationProject1(): void {
                [standardTypes, widget] = decorate(standardTypes, widget, config, ["CreationProject", "CreationProject2"])
                CreationProject1.exportWidget(...convertToCreationProject1(standardTypes, widget))
            },
            CreationProject2(): void {
                [standardTypes, widget] = decorate(standardTypes, widget, config, ["CreationProject", "CreationProject2"])
                CreationProject2.exportWidget(...convertToCreationProject2(standardTypes, widget))
            },
            NodeJS(): void {
                [standardTypes, widget] = decorate(standardTypes, widget, config, ["NodeJS"])
                NodeJSExport[standardTypes.type] = { types: standardTypes, widget }
            }
        })()
    }
}

function cloneTypes<T extends Types>(types: T): T {
    return clone(types, (data: unknown): unknown => {
        if (
            Array.isArray(data) || (
                data != null && typeof data == "object" &&
                Object.getPrototypeOf(data) == Object.prototype
            )
        ) {
            throw new UseDefaultClone()
        }
        return data
    })
}

export const NodeJSExport: Record<string, {
    types: StandardTypes,
    widget: Widget
}> = {}
