import packageInfo from "../../../package.json"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { typeToString } from "../runtime/type/utils"
import { RuntimeVoidType } from "../runtime/type/void-type"
import { ChildTypeInfo, RuntimeTypeData, Type } from "./type"
import { typeGenerateRuntimeData } from "./utils"

export class VoidType extends RuntimeVoidType implements Type<void> {

    public readonly key: string = "VoidType"

    public toJSON(this: this): RuntimeTypeData {
        return typeGenerateRuntimeData(packageInfo.name, "RuntimeVoidType", {})
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

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为方法参数类型`)
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {}
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为方法参数类型`)
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {}
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        throw new Error(`不能将 ${typeToString(this)} 作为属性类型`)
    }
}
