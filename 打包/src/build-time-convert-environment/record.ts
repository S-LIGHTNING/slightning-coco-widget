import fs from "fs"
import path from "path"

declare global {
    var __slightning_coco_widget_record_mode__: boolean | undefined
    var __slightning_coco_widget_platform__: string
    var __slightning_coco_widget_with_record_context__: typeof withRecordContext
    var __slightning_coco_widget_set_record__: typeof setRecord
    var __slightning_coco_widget_write_record__: typeof writeRecord
}

global.__slightning_coco_widget_record_mode__ = true

const contexts: string[] = []
let currentContext: string = ""

function withRecordContext(
    context: string,
    func: new (...args: unknown[]) => unknown
): (args: unknown[]) => unknown {
    return function withContext(this: unknown, ...args: unknown[]): unknown {
        contexts.push(currentContext)
        currentContext = context
        try {
            const returnValue = this instanceof withContext ? new func(...args) : func.apply(this, args)
            currentContext = contexts.pop() ?? ""
            return returnValue
        } catch (error) {
            currentContext = contexts.pop() ?? ""
            throw error
        }
    }
}

const record: Record<string, unknown> = {}

function setRecord(data: unknown): void {
    record[currentContext] = data
}

function writeRecord(filename: string): void {
    fs.mkdirSync(path.dirname(filename), { recursive: true })
    fs.writeFileSync(filename, JSON.stringify(record))
}

export default function (): void {
    global.__slightning_coco_widget_with_record_context__ = withRecordContext
    global.__slightning_coco_widget_set_record__ = setRecord
    global.__slightning_coco_widget_write_record__ = writeRecord
}
