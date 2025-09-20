import { buildTimeRecordData } from "./build-time-convert"
import { runtimeGetSuperWidget, RuntimeGetSuperWidgetData } from "./runtime/widget"
import { PropertiesTypes, Types } from "./types"

export type Widget = new (props: any) => {}

export function getSuperWidget(types: Types): Widget {
    const isVisibleWidget: boolean = types.options.visible
    const propertiesName: string[] = []
    const runtimeData: RuntimeGetSuperWidgetData = { isVisibleWidget, propertiesName }
    function addProperties(properties: PropertiesTypes): void {
        for (const property of properties) {
            if ("contents" in property) {
                addProperties(property.contents)
                continue
            }
            propertiesName.push(Array.isArray(property) ? property[0] : property.key)
        }
    }
    addProperties(types.properties)
    if (global.__slightning_coco_widget_record_mode__) {
        buildTimeRecordData(runtimeData)
        return class {}
    }
    return runtimeGetSuperWidget(runtimeData)
}
