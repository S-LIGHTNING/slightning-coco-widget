import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"

export class VoidType implements Type<void> {

    public toString(): string {
        return "无"
    }

    public validate(value: unknown): value is void {
        if (typeof value != "undefined") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${this.toString()}`, value, this)
        }
        return true
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        throw new Error(`不能将 ${this.toString()} 作为属性类型`)
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        throw new Error(`不能将 ${this.toString()} 作为方法参数类型`)
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {}
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        throw new Error(`不能将 ${this.toString()} 作为事件参数类型`)
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        throw new Error(`不能将 ${this.toString()} 作为属性类型`)
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        throw new Error(`不能将 ${this.toString()} 作为方法参数类型`)
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {}
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        throw new Error(`不能将 ${this.toString()} 作为属性类型`)
    }
}
