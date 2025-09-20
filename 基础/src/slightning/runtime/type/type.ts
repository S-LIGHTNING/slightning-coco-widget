import type * as stringify from "@slightning/anything-to-string"

export interface RuntimeType<T = unknown> {

    validate(this: this, value: unknown): value is T

    typeToStringPrepare?(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void
    typeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string
    inlineTypeToStringPrepare?(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void
    inlineTypeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string
}
