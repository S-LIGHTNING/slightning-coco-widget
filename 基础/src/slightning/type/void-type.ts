import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class VoidType implements Type<void> {

    public validate(this: this, value: unknown): value is void {
        if (typeof value != "undefined") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为方法参数类型`)
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {}
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为事件参数类型`)
    }

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为方法参数类型`)
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {}
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }
}
