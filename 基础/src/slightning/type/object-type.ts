import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { validate } from "./utils"

export class ObjectType<T extends {}> implements Type<T> {

    public readonly propertiesType: {
        [K in keyof T]: Type<T[K]>
    } | null | undefined
    public readonly defaultValue: T | string

    public constructor({
        propertiesType,
        defaultValue
    }: {
        propertiesType?: {
            [K in keyof T]: Type<T[K]>
        }
        defaultValue?: T | string | null | undefined
    } = {}) {
        this.propertiesType = propertiesType
        this.defaultValue = defaultValue ?? this.toInlineString()
    }

    public toString(): string {
        let result: string = "字典"
        if (this.propertiesType != null) {
            const properties = Object.entries<Type<T[keyof T]>>(this.propertiesType)
                .map(([key, type]: [string, Type<T[keyof T]>]): string => `${key}: ${type.toString()}`)
                .join("\n")
            result += ` {\n${properties}\n}`
        }
        return result
    }

    public toInlineString(): string {
        let result: string = "字典"
        if (this.propertiesType != null) {
            const properties = Object.entries<Type<T[keyof T]>>(this.propertiesType)
                .map(([key, type]: [string, Type<T[keyof T]>]): string => `${key}: ${type.toString()}`)
                .join("; ")
            result += ` { ${properties} }`
        }
        return result
    }

    public validate(value: unknown): value is T {
        if (value == null || typeof value != "object") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${this.toString()}`, value, this)
        }
        if (this.propertiesType != null) {
            const errors: TypeValidateError<T>[] = []
            for (const [key, type] of Object.entries<Type<T[keyof T]>>(this.propertiesType)) {
                try {
                    validate(`属性 ${key}`, (value as any)[key], type)
                } catch (error) {
                    if (!(error instanceof TypeValidateError)) {
                        throw error
                    }
                    errors.push(error)
                }
            }
            if (errors.length != 0) {
                throw new TypeValidateError(
                    `不能将 ${betterToString(value)} 分配给 ${this.toString()}\n` +
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

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }
}
