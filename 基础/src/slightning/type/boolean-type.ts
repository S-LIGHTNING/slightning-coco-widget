import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class BooleanType implements Type<boolean> {

    public readonly defaultValue: boolean

    public constructor(defaultValue: boolean)
    public constructor(props?: {
        defaultValue?: boolean | null | undefined
    } | boolean)
    public constructor(props: {
        defaultValue?: boolean | null | undefined
    } | boolean = {}) {
        if (typeof props == "boolean") {
            props = { defaultValue: props }
        }
        this.defaultValue = props.defaultValue ?? false
    }

    public validate(this: this, value: unknown): value is boolean {
        if (typeof value != "boolean") {
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
        return "布尔"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: "boolean",
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: "boolean",
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "boolean"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "boolean"
        }
    }

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        return {
            valueType: "boolean",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
        return {
            valueType: "boolean",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {
            valueType: "boolean"
        }
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        return {
            valueType: "boolean"
        }
    }
}
