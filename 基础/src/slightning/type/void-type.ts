import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { ChildTypeInfo, Type } from "./type"
import { typeToString } from "./utils"

export class VoidType implements Type<void> {

    public validate(this: this, __value: unknown): __value is void {
        return true
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return true
    }

    public typeToString(this: this): string {
        return "空"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
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
