import packageInfo from "../../../package.json"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { requireStringify, XMLEscape } from "../../utils"
import { RuntimeObjectType } from "../runtime/type/object-type"
import { inlineTypeToString } from "../runtime/type/utils"
import { ChildTypeInfo, RuntimeTypeData, Type } from "./type"
import { typeGenerateRuntimeData } from "./utils"

export class ObjectType<T extends {}> extends RuntimeObjectType<T> implements Type<T> {

    public readonly key: string = "ObjectType"

    public override readonly propertiesType: {
        [K in keyof T]: Type<T[K]>
    } | null | undefined
    public readonly defaultValue: T | string

    public constructor(props?: {
        propertiesType?: {
            [K in keyof T]: Type<T[K]>
        } | null | undefined
        defaultValue?: T | string | null | undefined
    } | null | undefined) {
        if (props == null) {
            props = {}
        }
        super(props)
        requireStringify()
        this.defaultValue = props.defaultValue ?? inlineTypeToString(this)
    }

    public toJSON(this: this): RuntimeTypeData {
        let propertiesType: Record<string, RuntimeTypeData> | null | undefined = null
        if (this.propertiesType != null) {
            propertiesType = {}
            for (const [key, type] of Object.entries<Type<T[keyof T]>>(this.propertiesType)) {
                propertiesType[key] = type.toJSON()
            }
        }
        return typeGenerateRuntimeData(packageInfo.name, "RuntimeObjectType", {
            propertiesType
        })
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return this.propertiesType == null ? [] : Object.entries<Type>(this.propertiesType as any).map(
            ([key, type]: [string, Type]): ChildTypeInfo => ({
                key: `__slightning_coco_widget_object_property__${key}`,
                label: `字典属性·${key}`,
                type: type
            })
        )
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return false
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

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: "object",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "object"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "object"
        }
    }
}
