import { buildTimeRecordData } from "../build-time-convert"
import { RuntimeLogger, RuntimeLoggerData } from "../runtime/utils/logger"
import { Types } from "../types"

export class Logger extends RuntimeLogger {
    public constructor(types: Types, widget: {}) {
        const runtimeData: RuntimeLoggerData = { widgetTitle: types.info.title }
        super(runtimeData, widget)
        buildTimeRecordData(runtimeData)
    }
}
