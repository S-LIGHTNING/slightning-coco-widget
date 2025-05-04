import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { XMLEscape } from "../../utils"
import { Type } from "./type"

export class AnyType implements Type<any> {

    public readonly defaultValue: any

    public constructor({
        defaultValue
    }: {
        defaultValue?: any | null | undefined
    } = {}) {
        this.defaultValue = defaultValue ?? ""
    }

    public toString(): string {
        return "任意"
    }

    public validate(__value: unknown): __value is any {
        return true
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"],
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: ["string", "number", "boolean", "array", "object"]
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }
}
