import type * as tStringify from "@slightning/anything-to-string"

import { betterToString, stringify } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString, validate } from "./utils"

export interface UnionTypeProps<T> {
    types: RuntimeType<T>[]
}

export class RuntimeUnionType<T> implements RuntimeType<T> {

    public readonly types: RuntimeType<T>[]

    public constructor(props: UnionTypeProps<T>) {
        this.types = props.types
    }

    public validate(this: this, value: unknown): value is T {
        const errors: TypeValidateError<T>[] = []
        for (const type of this.types) {
            try {
                validate(null, value, type)
                return true
            } catch (error) {
                if (!(error instanceof TypeValidateError)) {
                    throw error
                }
                errors.push(error)
            }
        }
        throw new TypeValidateError(
            `不能将 ${betterToString(value)} 分配给 ${typeToString(this)}\n` +
            errors.map(
                (error: TypeValidateError<T>): string =>
                    error.message
                        .split("\n")
                        .map((line: string): string => `　${line}`)
                        .join("\n")
            ).join("\n"),
            value,
            this
        )
    }

    public typeToStringPrepare(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.PrepareContext
    ): void {
        for (const type of this.types) {
            new stringify.AnythingRule().prepare(type, config, context)
        }
    }

    public typeToString(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.ToStringContext
    ): string {
        return this.types.length == 0 ? "空" : `(${this.types.map(
            (type: RuntimeType): string => new stringify.AnythingRule().toString(type, config, context)
        ).join(" | ")})`
    }

    public inlineTypeToStringPrepare(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.PrepareContext
    ): void {
        this.typeToStringPrepare(config, context)
    }

    public inlineTypeToString(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.ToStringContext
    ): string {
        return this.typeToString(config, context)
    }
}
