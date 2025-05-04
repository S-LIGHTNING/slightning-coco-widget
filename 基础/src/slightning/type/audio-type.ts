import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"

export class AudioType implements Type<string> {

    public readonly defaultValue: string

    public constructor({
        defaultValue,
    }: {
        defaultValue?: string | null | undefined

    } = {}) {
        this.defaultValue = defaultValue ?? "?"
    }

    public toString(): string {
        return "音频"
    }

    public validate(value: unknown): value is string {
        if (typeof value != "string") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${this.toString()}`, value, this)
        }
        return true
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        return {
            valueType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: "string"
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
            valueType: "audio",
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
