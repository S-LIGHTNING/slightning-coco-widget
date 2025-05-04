import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { validate } from "./utils"

export class ArrayType<T> implements Type<T[]> {

    public readonly itemType: Type<T> | null | undefined
    public readonly defaultValue: T[] | string

    public constructor({
        itemType,
        defaultValue
    }: {
        itemType?: Type<T> | null | undefined
        defaultValue?: T[] | string | null | undefined
    } = {}) {
        this.itemType = itemType
        this.defaultValue = defaultValue ?? this.toString()
    }

    public toString(): string {
        let result: string = "列表"
        if (this.itemType != null) {
            result += `<${this.itemType.toString()}>`
        }
        return result
    }

    public validate(value: unknown): value is T[] {
        if (!Array.isArray(value)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${this.toString()}`, value, this)
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
                    `不能将 ${betterToString(value)} 分配给 ${this.toString()}\n` +
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

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "array"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "array"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "array"
        }
    }
}
