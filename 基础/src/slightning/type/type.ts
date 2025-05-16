import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"

export interface ChildTypeInfo {
    key: string
    label: string
    type: Type
}

export interface Type<T = unknown> {

    validate(value: unknown): value is T

    getSameDirectionChildren(): ChildTypeInfo[]
    getReverseDirectionChildren(): ChildTypeInfo[]

    toCoCoPropertyValueTypes(): CoCo.PropertyValueTypes
    toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes
    toCoCoMethodValueTypes(): CoCo.MethodValueTypes
    toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes

    toCreationProjectPropValueTypes(): CreationProject.PropValueTypes
    toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes
    toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes
    toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes
}
