import * as stringify from "@slightning/anything-to-string"
import { betterToString } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"

export function validate<T>(name: string | null, value: unknown, type: Type<T>): asserts value is T {
    let message: string | null = null, result: boolean = false
    try {
        result = type.validate(value)
    } catch (error) {
        if (!(error instanceof TypeValidateError)) {
            throw error
        }
        message = error.message
    }
    if (!result && message == null) {
        message = `不能将 ${betterToString(value)} 分配给 ${typeToString(type)}`
    }
    if (message != null) {
        if (name != null) {
            message = `${name}：${message}`
        }
        throw new TypeValidateError<T>(message, value, type)
    }
}

export function typeToString(type: Type): string {
    return stringify.default(type, {
        rules: [
            {
                test(__data: unknown): __data is Type {
                    return true
                },
                prepare(
                    data: Type,
                    config: stringify.RequiredConfig,
                    context: stringify.PrepareContext
                ): void {
                    data.typeToStringPrepare?.(config, context)
                },
                toString(
                    data: Type,
                    config: stringify.RequiredConfig,
                    context: stringify.ToStringContext
                ): string {
                    return data.typeToString(config, context)
                }
            }
        ]
    })
}

export function inlineTypeToString(type: Type): string {
    return stringify.default(type, {
        rules: [
            {
                test(__data: unknown): __data is Type {
                    return true
                },
                prepare(
                    data: Type,
                    config: stringify.RequiredConfig,
                    context: stringify.PrepareContext
                ): void {
                    data.inlineTypeToStringPrepare?.(config, context)
                },
                toString(
                    data: Type,
                    config: stringify.RequiredConfig,
                    context: stringify.ToStringContext
                ): string {
                    return data.inlineTypeToString(config, context)
                }
            }
        ]
    })
}
