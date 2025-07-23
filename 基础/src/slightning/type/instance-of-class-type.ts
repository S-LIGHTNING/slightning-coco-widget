import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class InstanceOfClassType<T> implements Type<T> {

    public readonly theClass: new (...args: any[]) => T
    public readonly defaultValue: string

    public constructor(theClass: new (...args: any[]) => T)
    public constructor(props: {
        theClass: new (...args: any[]) => T
        defaultValue?: string | null | undefined
    })
    public constructor(props: {
        theClass: new (...args: any[]) => T
        defaultValue?: string | null | undefined
    } | (new (...args: any[]) => T)) {
        if (typeof props == "function") {
            props = { theClass: props }
        }
        this.theClass = props.theClass
        this.defaultValue = props.defaultValue ?? `实例<${props.theClass.name}>`
    }

    public validate(this: this, value: unknown): value is T {
        if (!(value instanceof this.theClass)) {
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
        return `实例<${this.theClass.name}>`
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "object"],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
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

export { InstanceOfClassType as InstanceType }
