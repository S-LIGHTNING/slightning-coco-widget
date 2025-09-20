import type * as tStringify from "@slightning/anything-to-string"

import { betterToString, stringify } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString, validate } from "./utils"

export interface RuntimeArrayTypeProps<T> {
    itemType?: RuntimeType<T> | null | undefined
}

export class RuntimeArrayType<T> implements RuntimeType<T[]> {

    public readonly itemType: RuntimeType<T> | null | undefined

    public constructor({ itemType }: RuntimeArrayTypeProps<T>) {
        this.itemType = itemType
    }

    public validate(this: this, value: unknown): value is T[] {
        if (!Array.isArray(value)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        if (this.itemType != null) {
            const errors: TypeValidateError<T[]>[] = []
            for (const [index, item] of Object.entries(errors)) {
                try {
                    validate(`第 ${index} 项`, item, this.itemType)
                } catch (error) {
                    if (!(error instanceof TypeValidateError)) {
                        throw error
                    }
                    errors.push(error)
                }
            }
            if (errors.length != 0) {
                throw new TypeValidateError(
                    `不能将 ${betterToString(value)} 分配给 ${typeToString(this)}：\n` +
                    errors.map(
                        (error: TypeValidateError<T[]>): string =>
                            error.message
                                .split("\n")
                                .map((line: string): string => `　${line}`)
                                .join("\n")
                    ).join("\n"),
                    value,
                    this
                )
            }
        }
        return true
    }

    public typeToStringPrepare(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.PrepareContext
    ): void {
        if (this.itemType != null) {
            new stringify.AnythingRule().prepare(this.itemType, config, context)
        }
    }

    public typeToString(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.ToStringContext
    ): string {
        let result: string = "列表"
        if (this.itemType != null) {
            result += `<${new stringify.AnythingRule().toString(this.itemType, config, context)}>`
        }
        return result
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
