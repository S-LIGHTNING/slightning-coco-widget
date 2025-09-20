import packageInfo from "../../../package.json"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { RuntimeUnionType } from "../runtime/type/union-type"
import { ChildTypeInfo, RuntimeTypeData, Type } from "./type"
import { typeGenerateRuntimeData } from "./utils"

export class UnionType<T> extends RuntimeUnionType<T> implements Type<T> {

    public readonly key: string = "UnionType"
    public override readonly types: Type<T>[]
    public readonly defaultValue: string | number | boolean

    public constructor(...types: Type<T>[]) {
        super({ types })
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
        this.types = types
        this.defaultValue ??= ""
    }

    public toJSON(this: this): RuntimeTypeData {
        return typeGenerateRuntimeData(packageInfo.name, "RuntimeUnionType", {
            types: this.types.map((type): RuntimeTypeData => type.toJSON())
        })
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        const result: ChildTypeInfo[] = []
        for (let i: number = 0; i < this.types.length; i++) {
            const type: Type | undefined = this.types[i] as any
            if (type != undefined) {
                result.push({
                    key: `__slightning_coco_widget_union_type_child__${i}_${type.key ?? "unknown"}`,
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
        return this.types.every((type: any): boolean => type.isVoid?.() ?? false)
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
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: "any",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: "any",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }
}
