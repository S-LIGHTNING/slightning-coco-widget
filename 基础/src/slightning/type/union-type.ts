import * as stringify from "@slightning/anything-to-string"

import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
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

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
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

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return this.types.every((type: Type): boolean => type.isVoid())
    }

    public typeToStringPrepare(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void {
        for (const type of this.types) {
            new stringify.AnythingRule().prepare(type, config, context)
        }
    }

    public typeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string {
        return this.types.length == 0 ? "空" : `(${this.types.map(
            (type: Type): string => new stringify.AnythingRule().toString(type, config, context)
        ).join(" | ")})`
    }

    public inlineTypeToStringPrepare(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void {
        this.typeToStringPrepare(config, context)
    }

    public inlineTypeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string {
        return this.typeToString(config, context)
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
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

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
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

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
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

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
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

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 转为 Creation Project 属性类型`)
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: "any",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "any"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "any"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 转为 Creation Project 属性类型`)
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: "any",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "any"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "any"
        }
    }
}
