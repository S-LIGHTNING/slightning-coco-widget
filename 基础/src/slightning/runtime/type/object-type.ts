import type * as tStringify from "@slightning/anything-to-string"

import { betterToString, stringify } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString, validate } from "./utils"

export interface ObjectTypeProps<T extends {} = {}> {
    propertiesType?: {
        [K in keyof T]: RuntimeType<T[K]>
    } | null | undefined
}

export class RuntimeObjectType<T extends {} = {}> implements RuntimeType<T> {

    public readonly propertiesType: {
        [K in keyof T]: RuntimeType<T[K]>
    } | null | undefined

    public constructor(props: ObjectTypeProps<T>) {
        this.propertiesType = props.propertiesType
    }

    public validate(this: this, value: unknown): value is T {
        if (value == null || typeof value != "object") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        if (this.propertiesType != null) {
            const errors: TypeValidateError<T>[] = []
            for (const [key, type] of Object.entries<RuntimeType<T[keyof T]>>(this.propertiesType)) {
                try {
                    if (key in value) {
                        validate(`属性 ${key}`, (value as any)[key], type)
                    } else {
                        throw new TypeValidateError(`属性 ${key} 缺失`, value, this)
                    }
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
        }
        return true
    }

    public typeToStringPrepare(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.PrepareContext
    ): void {
        if (this.propertiesType != null) {
            for (const propertyType of Object.values(this.propertiesType)) {
                new stringify.AnythingRule().prepare(propertyType, config, context)
            }
        }
    }

    public typeToString(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.ToStringContext
    ): string {
        let result: string = "字典"
        if (this.propertiesType != null) {
            const properties: string = Object.entries<RuntimeType>(this.propertiesType)
                .map(([key, type]: [string, RuntimeType]): string => `${key}: ${new stringify.AnythingRule().toString(type, config, context)}`)
                .join("\n")
                .split("\n")
                .map((line: string): string => `　${line}`)
                .join("\n")
            result += ` {\n${properties}\n}`
        }
        return result
    }

    public inlineTypeToStringPrepare(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.PrepareContext
    ): void {
        if (this.propertiesType != null) {
            for (const propertyType of Object.values(this.propertiesType)) {
                new stringify.AnythingRule().prepare(propertyType, config, context)
            }
        }
    }

    public inlineTypeToString(
        this: this,
        config: tStringify.RequiredConfig,
        context: tStringify.ToStringContext
    ): string {
        let result: string = "字典"
        if (this.propertiesType != null) {
            const properties: string = Object.entries<RuntimeType>(this.propertiesType)
                .map(([key, type]: [string, RuntimeType]): string => `${key}: ${new stringify.AnythingRule().toString(type, config, context)
                    }`)
                .join("; ")
            result += ` { ${properties} }`
        }
        return result
    }
}
