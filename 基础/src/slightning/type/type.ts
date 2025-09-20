import type { RuntimeType } from "../runtime"
import type * as CoCo from "../../coco"
import type * as CreationProject1 from "../../creation-project-1"
import type * as CreationProject2 from "../../creation-project-2"

export interface ChildTypeInfo {
    key: string
    label: string
    type: Type
}

export interface RuntimeTypeData {
    __slightning_coco_widget_object__: true
    func: {
        source: string
        name: string
    }
    data: unknown
}

export interface Type<T = unknown> extends RuntimeType<T> {

    key: string

    toJSON(): RuntimeTypeData

    getSameDirectionChildren(this: this): ChildTypeInfo[]
    getReverseDirectionChildren(this: this): ChildTypeInfo[]

    isVoid(this: this): boolean

    toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes
    toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes
    toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes
    toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes

    toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes
    toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes
    toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes
    toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes

    toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes
    toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes
    toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes
    toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes
}
