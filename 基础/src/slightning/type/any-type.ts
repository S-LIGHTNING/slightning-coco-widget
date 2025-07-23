import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { XMLEscape } from "../../utils"
import { ChildTypeInfo, Type } from "./type"

export class AnyType implements Type<any> {

    public readonly defaultValue: any

    public constructor(defaultValue: string | number | boolean)
    public constructor(props?: {
        defaultValue?: any | null | undefined
    } | string | number | boolean)
    public constructor(props: {
        defaultValue?: any | null | undefined
    } | string | number | boolean = {}) {
        if (typeof props != "object") {
            props = { defaultValue: props }
        }
        this.defaultValue = props.defaultValue ?? ""
    }

    public validate(this: this, __value: unknown): __value is any {
        return true
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

    public typeToString(this: this): string {
        return "任意"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
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

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }
}
