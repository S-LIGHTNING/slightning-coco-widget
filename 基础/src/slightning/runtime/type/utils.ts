import type * as tStringify from "@slightning/anything-to-string"
import { betterToString, stringify } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"

export function validate<T>(name: string | null, value: unknown, type: RuntimeType<T>): asserts value is T {
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

export function typeToString(type: RuntimeType): string {
    return stringify.default(type, {
        rules: [
            {
                test(__data: unknown): __data is RuntimeType {
                    return true
                },
                prepare(
                    data: RuntimeType,
                    config: tStringify.RequiredConfig,
                    context: tStringify.PrepareContext
                ): void {
                    data.typeToStringPrepare?.(config, context)
                },
                toString(
                    data: RuntimeType,
                    config: tStringify.RequiredConfig,
                    context: tStringify.ToStringContext
                ): string {
                    return data.typeToString(config, context)
                }
            }
        ]
    })
}

export function inlineTypeToString(type: RuntimeType): string {
    return stringify.default(type, {
        rules: [
            {
                test(__data: unknown): __data is RuntimeType {
                    return true
                },
                prepare(
                    data: RuntimeType,
                    config: tStringify.RequiredConfig,
                    context: tStringify.PrepareContext
                ): void {
                    data.inlineTypeToStringPrepare?.(config, context)
                },
                toString(
                    data: RuntimeType,
                    config: tStringify.RequiredConfig,
                    context: tStringify.ToStringContext
                ): string {
                    return data.inlineTypeToString(config, context)
                }
            }
        ]
    })
}
