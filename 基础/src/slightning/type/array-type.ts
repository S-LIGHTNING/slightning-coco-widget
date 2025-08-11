import * as stringify from "@slightning/anything-to-string"

import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { betterToString, XMLEscape } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { inlineTypeToString, typeToString, validate } from "./utils"

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
        this.defaultValue = defaultValue ?? inlineTypeToString(this)
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

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return this.itemType == null ? [] : [{
            key: "__slightning_coco_widget_array_item__",
            label: "数组项",
            type: this.itemType
        }]
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return false
    }

    public typeToStringPrepare(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void {
        if (this.itemType != null) {
            new stringify.AnythingRule().prepare(this.itemType, config, context)
        }
    }

    public typeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string {
        let result: string = "列表"
        if (this.itemType != null) {
            result += `<${new stringify.AnythingRule().toString(this.itemType, config, context)}>`
        }
        return result
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
        return {
            valueType: ["string", "array"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "array"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "array"
        }
    }
}
