import { betterToString, CoCoLogToLineArray } from "../../utils"
import { getDefaultAdapter, LoggerAdapter } from "../adapters/adapter"
import { Types } from "../types"

export class Logger {

    private readonly types: Types
    private readonly adapter: LoggerAdapter

    public constructor(types: Types, widget: {}) {
        this.types = types
        this.adapter = new (getDefaultAdapter().Logger)(types, widget)
    }

    public log(...messages: unknown[]): void {
        this.outputLog({
            messages,
            editor: this.adapter.log.bind(this.adapter),
            browser:
                messages.some(
                    (message: unknown) : boolean =>
                        ["function", "object"].includes(typeof message)
                ) ? console.log : null
        })
    }

    public info(...messages: unknown[]): void {
        this.outputLog({
            messages,
            editor: this.adapter.info.bind(this.adapter),
            browser: console.info
        })
    }

    public warn(...messages: unknown[]): void {
        this.outputLog({
            messages,
            editor: this.adapter.warn.bind(this.adapter),
            browser: console.warn
        })
    }

    public error(...messages: unknown[]): void {
        this.outputLog({
            messages,
            editor: this.adapter.error.bind(this.adapter),
            browser: console.error
        })
    }

    private outputLog({
        messages, editor, browser
    }: {
        messages: unknown[]
        editor: ((message: string) => void) | null | undefined
        browser: ((...data: any[]) => void) | null | undefined
    }): void {
        if (editor != null) {
            for (const line of CoCoLogToLineArray(messages.map((message: unknown): string =>
                typeof message == "string" ? message : betterToString(message)
            ).join(" "))) {
                editor(line)
            }
        }
        browser?.(`[自定义控件 ${this.types.info.title}]`, ...messages)
    }
}
