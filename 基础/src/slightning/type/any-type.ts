import packageInfo from "../../../package.json"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { XMLEscape } from "../../utils"
import { RuntimeAnyType } from "../runtime/type/any-type"
import { ChildTypeInfo, RuntimeTypeData, Type } from "./type"
import { typeGenerateRuntimeData } from "./utils"

export class AnyType extends RuntimeAnyType implements Type<any> {

    public readonly key: string = "AnyType"
    public readonly defaultValue: any

    public constructor(defaultValue: string | number | boolean)
    public constructor(props?: {
        defaultValue?: any | null | undefined
    } | string | number | boolean | null | undefined)
    public constructor(props?: {
        defaultValue?: any | null | undefined
    } | string | number | boolean | null | undefined) {
        super()
        if (props == null) {
            props = {}
        } else if (typeof props != "object") {
            props = { defaultValue: props }
        }
        this.defaultValue = props.defaultValue ?? ""
    }

    public toJSON(this: this): RuntimeTypeData {
        return typeGenerateRuntimeData(packageInfo.name, "RuntimeAnyType", {})
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return false
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
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
            valueType: "string",
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
            valueType: "string",
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
