import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class VoidType implements Type<void> {

    public validate(value: unknown): value is void {
        if (typeof value != "undefined") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }

    public getSameDirectionChildren(): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(): ChildTypeInfo[] {
        return []
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为方法参数类型`)
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {}
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为事件参数类型`)
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为方法参数类型`)
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {}
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }
}
