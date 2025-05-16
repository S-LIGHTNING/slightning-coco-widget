import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString, validate } from "./utils"

export class UnionType<T> implements Type<T> {

    public readonly types: Type<T>[]
    public readonly defaultValue: string | number | boolean

    public constructor(...types: Type<T>[]) {
        this.types = types
        for (const type of types) {
            if (
                "defaultValue" in type &&
                (
                    typeof type.defaultValue == "string" ||
                    typeof type.defaultValue == "number" ||
                    typeof type.defaultValue == "boolean"
                )
            ) {
                this.defaultValue = type.defaultValue
                break
            }
        }
        this.defaultValue ??= ""
    }

    public toString(): string {
        return this.types.length == 0 ? "（不存在）" : this.types.join(" | ")
    }

    public validate(value: unknown): value is T {
        const errors: TypeValidateError<T>[] = []
        for (const type of this.types) {
            try {
                if (validate(null, value, type)) {
                    return true
                }
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

    public getSameDirectionChildren(): ChildTypeInfo[] {
        const result: ChildTypeInfo[] = []
        for (let i: number = 0; i < this.types.length; i++) {
            const type: Type | undefined = this.types[i]
            if (type != undefined) {
                result.push({
                    key: `__slightning_coco_widget_union_type_child__${i}_${Object.getPrototypeOf(type)?.constructor?.name ?? "unknown"}`,
                    label: String(i),
                    type: type
                })
            }
        }
        return result
    }

    public getReverseDirectionChildren(): ChildTypeInfo[] {
        return []
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        const valueTypes: CoCo.SignalValueType[] = []
        for (const type of this.types) {
            const { valueType } = type.toCoCoMethodValueTypes()
            if (Array.isArray(valueType)) {
                valueTypes.push(...valueType)
            } else if (valueType != null) {
                valueTypes.push(valueType)
            }
        }
        return {
            valueType: valueTypes,
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        const valueTypes: CoCo.SignalValueType[] = []
        for (const type of this.types) {
            const { valueType } = type.toCoCoMethodValueTypes()
            if (Array.isArray(valueType)) {
                valueTypes.push(...valueType)
            } else if (valueType != null) {
                valueTypes.push(valueType)
            }
        }
        return {
            valueType: valueTypes,
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        const valueTypes: CoCo.SignalValueType[] = []
        for (const type of this.types) {
            const { valueType } = type.toCoCoMethodValueTypes()
            if (Array.isArray(valueType)) {
                valueTypes.push(...valueType)
            } else if (valueType != null) {
                valueTypes.push(valueType)
            }
        }
        return {
            valueType: valueTypes
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        const valueTypes: CoCo.SignalValueType[] = []
        for (const type of this.types) {
            const { valueType } = type.toCoCoMethodValueTypes()
            if (Array.isArray(valueType)) {
                valueTypes.push(...valueType)
            } else if (valueType != null) {
                valueTypes.push(valueType)
            }
        }
        return {
            valueType: valueTypes
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 转为 Creation Project 属性类型`)
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: "any",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "any"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "any"
        }
    }
}
