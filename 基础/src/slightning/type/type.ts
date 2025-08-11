import * as stringify from "@slightning/anything-to-string"

import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"

export interface ChildTypeInfo {
    key: string
    label: string
    type: Type
}

export interface Type<T = unknown> {

    validate(this: this, value: unknown): value is T

    getSameDirectionChildren(this: this): ChildTypeInfo[]
    getReverseDirectionChildren(this: this): ChildTypeInfo[]

    isVoid(this: this): boolean

    typeToStringPrepare?(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void
    typeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string
    inlineTypeToStringPrepare?(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.PrepareContext
    ): void
    inlineTypeToString(
        this: this,
        config: stringify.RequiredConfig,
        context: stringify.ToStringContext
    ): string

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
