import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, Range } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class IntegerType implements Type<number> {

    public readonly defaultValue: number
    public readonly range: Range | null | undefined

    public constructor({
        defaultValue = 0, range
    }: {
        defaultValue?: number | null | undefined
        range?: Range | null | undefined
    } = {}) {
        this.defaultValue = defaultValue ?? 0
        this.range = range
    }

    public validate(value: unknown): value is number {
        if (typeof value != "number") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        if (this.range != null && !this.range.includes(value)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}：整数超出范围`, value, this)
        }
        return true
    }

    public getSameDirectionChildren(): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(): ChildTypeInfo[] {
        return []
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: "number"
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: "number"
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: "number",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "number"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "number"
        }
    }
}
