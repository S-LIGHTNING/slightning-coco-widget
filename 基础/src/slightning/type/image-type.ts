import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class ImageType implements Type<string> {

    public readonly defaultValue: string

    public constructor(defaultValue: string)
    public constructor(props?: {
        defaultValue?: string | null | undefined
    } | string)
    public constructor(props: {
        defaultValue?: string | null | undefined
    } | string = {}) {
        if (typeof props == "string") {
            props = { defaultValue: props }
        }
        this.defaultValue = props.defaultValue ?? "?"
    }

    public validate(this: this, value: unknown): value is string {
        if (typeof value != "string") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
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
        return "图像"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: "image",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: "image",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "image"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "image"
        }
    }

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        return {
            valueType: "image",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
        return {
            valueType: "image",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {
            valueType: "image"
        }
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        return {
            valueType: "image"
        }
    }
}
