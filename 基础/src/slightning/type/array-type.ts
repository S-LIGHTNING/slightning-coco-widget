import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString, validate } from "./utils"

export class ArrayType<T> implements Type<T[]> {

    public readonly itemType: Type<T> | null | undefined
    public readonly defaultValue: T[] | string

    public constructor({
        itemType, defaultValue
    }: {
        itemType?: Type<T> | null | undefined
        defaultValue?: T[] | string | null | undefined
    } = {}) {
        this.itemType = itemType
        this.defaultValue = defaultValue ?? typeToString(this)
    }

    public validate(value: unknown): value is T[] {
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
                    `不能将 ${betterToString(value)} 分配给 ${typeToString(this)}\n` +
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

    public getSameDirectionChildren(): ChildTypeInfo[] {
        return this.itemType == null ? [] : [{
            key: "__slightning_coco_widget_array_item__",
            label: "数组项",
            type: this.itemType
        }]
    }

    public getReverseDirectionChildren(): ChildTypeInfo[] {
        return []
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
