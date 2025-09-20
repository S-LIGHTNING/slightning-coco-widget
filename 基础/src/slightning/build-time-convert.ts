declare global {
    var __slightning_coco_widget_record_mode__: boolean | undefined
    var __slightning_coco_widget_platform__: string | undefined
    function __slightning_coco_widget_with_record_context__(context: string, func: (...args: unknown[]) => unknown): (args: unknown[]) => unknown
    function __slightning_coco_widget_set_record__(data: unknown): void
    function __slightning_coco_widget_write_record__(filename: string): void
}

export function buildTimeRecordData(data: unknown): void {
    if (!global.__slightning_coco_widget_record_mode__) {
        return
    }
    __slightning_coco_widget_set_record__(data)
}
