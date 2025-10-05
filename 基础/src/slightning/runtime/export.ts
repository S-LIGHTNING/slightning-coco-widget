import { crossPlatform, getPlatform, StandardPlatform } from "./cross-platform"
import { Widget } from "../widget"
import { RuntimeDecorator } from "./decorators"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { widgetToCoCo, widgetToCreationProject1, widgetToCreationProject2 } from "../convert"
import { eventKeyMap } from "./utils/emit"

export interface RuntimeExportConfig {
    decorators: [Record<StandardPlatform, (RuntimeDecorator | null | undefined)[]>]
}

export interface RuntimeExportWidgetData {
    eventKeyMap: Record<string, string>
    types: {
        CoCo?: CoCo.Types
        CreationProject1?: CreationProject1.Types
        CreationProject2?: CreationProject2.Types
    }
}

export function runtimeExportWidget(
    runtimeData: RuntimeExportWidgetData,
    widget: Widget,
    config?: RuntimeExportConfig | null | undefined
): void {
    if (config != null) {
        for (const decorator of config.decorators[0][getPlatform()]) {
            if (decorator != null) {
                widget = decorator(widget)
            }
        }
    }
    const { types } = runtimeData
    Object.assign(eventKeyMap, runtimeData.eventKeyMap)
    crossPlatform({
        CoCo(): void {
            CoCo.exportWidget(types.CoCo!, widgetToCoCo(widget))
        },
        CreationProject1(): void {
            CreationProject1.exportWidget(types.CreationProject1!, widgetToCreationProject1(widget))
        },
        CreationProject2(): void {
            CreationProject2.exportWidget(types.CreationProject2!, widgetToCreationProject2(widget))
        },
        NodeJS(): void {
            throw new Error("不支持在 Node.js 中使用构建期生成")
        }
    })()
}
