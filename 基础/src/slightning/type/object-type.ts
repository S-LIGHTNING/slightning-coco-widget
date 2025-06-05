import * as stringify from "@slightning/anything-to-string"
import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString, validate } from "./utils"

export class ObjectType<T extends {}> implements Type<T> {

    public readonly propertiesType: {
        [K in keyof T]: Type<T[K]>
    } | null | undefined
    public readonly defaultValue: T | string

    public constructor({
        propertiesType, defaultValue
    }: {
        propertiesType?: {
            [K in keyof T]: Type<T[K]>
        }
        defaultValue?: T | string | null | undefined
    } = {}) {
        this.propertiesType = propertiesType
        this.defaultValue = defaultValue ?? this.toInlineString()
    }

    public toInlineString(this: this): string {
        return typeToString(this, [{
            test(data: unknown): data is ObjectType<{}> {
                return data instanceof ObjectType
            },
            prepare(
                data: ObjectType<{}>,
                config: stringify.RequiredConfig,
                context: stringify.PrepareContext
            ): void {
                if (data.propertiesType != null) {
                    for (const propertyType of Object.values(data.propertiesType)) {
                        new stringify.AnythingRule().prepare(propertyType, config, context)
                    }
                }
            },
            toString(
                data: ObjectType<{}>,
                config: stringify.RequiredConfig,
                context: stringify.ToStringContext
            ): string {
                let result: string = "字典"
                if (data.propertiesType != null) {
                    const properties: string = Object.entries<Type<T[keyof T]>>(data.propertiesType)
                        .map(([key, type]: [string, Type<T[keyof T]>]): string => `${key}: ${
                            new stringify.AnythingRule().toString(type, config, context)
                        }`)
                        .join("; ")
                    result += ` { ${properties} }`
                }
                return result
            },
        }])
    }

    public validate(this: this, value: unknown): value is T {
        if (value == null || typeof value != "object") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
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
        }
        return true
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return this.propertiesType == null ? [] : Object.entries<Type<unknown>>(this.propertiesType).map(
            ([key, type]: [string, Type<unknown>]): ChildTypeInfo => ({
                key: `__slightning_coco_widget_object_property__${key}`,
                label: `字典属性·${key}`,
                type: type
            })
        )
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }
}
