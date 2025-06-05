import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, Range } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class IntegerType implements Type<number> {

    public readonly defaultValue: number
    public readonly range: Range | null | undefined

    public constructor(defaultValue: number)
    public constructor(props?: {
        defaultValue?: number | null | undefined
        range?: Range | null | undefined
    } | number)
    public constructor(props: {
        defaultValue?: number | null | undefined
        range?: Range | null | undefined
    } | number = {}) {
        if (typeof props == "number") {
            props = { defaultValue: props }
        }
        this.defaultValue = props.defaultValue ?? 0
        this.range = props.range
    }

    public validate(this: this, value: unknown): value is number {
        if (typeof value != "number") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        if (this.range != null && !this.range.includes(value)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}：整数超出范围`, value, this)
        }
        return true
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "number"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "number"
        }
    }

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {
            valueType: "number"
        }
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        return {
            valueType: "number"
        }
    }
}
