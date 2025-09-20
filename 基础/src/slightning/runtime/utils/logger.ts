import { betterToString, loadStringify, logToLine } from "../../../utils"
import { crossPlatform } from "../cross-platform"
import * as CoCo from "../../../coco"
import * as CreationProject1 from "../../../creation-project-1"
import * as CreationProject2 from "../../../creation-project-2"

export interface LoggerAdapter {
    log(this: this, message: string): void
    info(this: this, message: string): void
    warn(this: this, message: string): void
    error(this: this, message: string): void
}

export interface RuntimeLoggerData {
    widgetTitle: string
}

const getLoggerAdapter = crossPlatform<(widget: {}) => LoggerAdapter>({
    CoCo: getAdapterGenerator.bind(null, CoCo.InvisibleWidget),
    CreationProject1: getAdapterGenerator.bind(null, CreationProject1.widgetClass),
    CreationProject2: getAdapterGenerator.bind(null, CreationProject2.widgetClass),
    NodeJS: (): LoggerAdapter => ({
        log(): void {},
        info(): void {},
        warn(): void {},
        error(): void {}
    })
})

function getAdapterGenerator(
    { prototype: {
        widgetLog,
        widgetInfo = function (messages: string): void {
            widgetLog.call(widget, `[信息] ${messages}`)
        },
        widgetWarn,
        widgetError
    } }: {
        prototype: {
            widgetLog(this: any, message: string): void
            widgetInfo?(this: any, message: string): void
            widgetWarn(this: any, message: string): void
            widgetError(this: any, message: string): void
        }
    },
    widget: any
): LoggerAdapter {
    return {
        log: widgetLog.bind(widget),
        info: widgetInfo.bind(widget),
        warn: widgetWarn.bind(widget),
        error: widgetError.bind(widget)
    }
}

export class RuntimeLogger {

    private readonly widgetTitle: string
    private readonly adapter: LoggerAdapter

    public constructor(data: RuntimeLoggerData, widget: {}) {
        this.widgetTitle = data.widgetTitle
        this.adapter = getLoggerAdapter(widget)
    }

    public log(...messages: unknown[]): void {
        this.output(messages, "log", messages.every(
            (message: unknown) : boolean => !["function", "object"].includes(typeof message)
        ))
    }

    public info(...messages: unknown[]): void {
        this.output(messages, "info")
    }

    public warn(...messages: unknown[]): void {
        this.output(messages, "warn")
    }

    public error(...messages: unknown[]): void {
        this.output(messages, "error")
    }

    private async output(
        messages: unknown[],
        key: keyof LoggerAdapter,
        browser?: boolean | null | undefined
    ): Promise<void> {
        if (browser != false) {
            console[key](`[自定义控件 ${this.widgetTitle}]`, ...messages)
        }
        await loadStringify()
        for (const line of logToLine(messages.map((message: unknown): string =>
            typeof message == "string" ? message : betterToString(message)
        ).join(" "))) {
            this.adapter[key](line)
        }
    }
}
