import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"

export interface ChildTypeInfo {
    key: string
    label: string
    type: Type
}

export interface Type<T = unknown> {

    validate(this: this, value: unknown): value is T

    getSameDirectionChildren(this: this): ChildTypeInfo[]
    getReverseDirectionChildren(this: this): ChildTypeInfo[]

    toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes
    toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes
    toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes
    toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes

    toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes
    toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes
    toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes
    toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes
}
