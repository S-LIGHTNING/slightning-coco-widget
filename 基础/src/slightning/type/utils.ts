import { RuntimeTypeData } from "./type"

export function typeGenerateRuntimeData(source: string, name: string, data: unknown): RuntimeTypeData {
    return {
        __slightning_coco_widget_object__: true,
        func: { source, name },
        data
    }
}
