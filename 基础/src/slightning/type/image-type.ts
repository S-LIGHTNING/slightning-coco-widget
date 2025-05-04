import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"

export class ImageType implements Type<string> {

    public readonly defaultValue: string

    public constructor({
        defaultValue,
    }: {
        defaultValue?: string | null | undefined

    } = {}) {
        this.defaultValue = defaultValue ?? "?"
    }

    public toString(): string {
        return "图像"
    }

    public validate(value: unknown): value is string {
        if (typeof value != "string") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${this.toString()}`, value, this)
        }
        return true
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        return {
            valueType: "image",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: "image",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: "image"
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: "image"
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        return {
            valueType: "image",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: "image",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "image"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "image"
        }
    }
}
