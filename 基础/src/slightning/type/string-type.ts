import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString, XMLEscape } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export enum StringInputType {
    INLINE = "INLINE",
    MULTILINE = "MULTILINE",
    RICH = "RICH"
}

const COCO_EDITOR_TYPE_MAP: Record<StringInputType, CoCo.EditorType> = {
    [StringInputType.INLINE]: "TextInput",
    [StringInputType.MULTILINE]: "TextArea",
    [StringInputType.RICH]: "RichTextEditor"
}

const COCO_VALUE_TYPE_MAP: Record<StringInputType, CoCo.ValueType> = {
    [StringInputType.INLINE]: "string",
    [StringInputType.MULTILINE]: "multilineString",
    [StringInputType.RICH]: "richTextString"
}

const CREATION_PROJECT_VALUE_TYPE_MAP: Record<StringInputType, CreationProject.ValueType> = {
    [StringInputType.INLINE]: "string",
    [StringInputType.MULTILINE]: "multiline_string",
    [StringInputType.RICH]: "multiline_string"
}

export class StringType implements Type<string> {

    public readonly defaultValue: string
    public readonly inputType: StringInputType

    public constructor(props: {
        defaultValue?: string | null | undefined
        inputType?: StringInputType | null | undefined

    } | string = {}) {
        if (typeof props == "string") {
            props = { defaultValue: props }
        }
        this.defaultValue = props.defaultValue ?? ""
        this.inputType = props.inputType ?? StringInputType.INLINE
    }

    public validate(value: unknown): value is string {
        if (typeof value != "string") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
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
            editorType: COCO_EDITOR_TYPE_MAP[this.inputType],
            valueType: "string",
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            valueType: COCO_VALUE_TYPE_MAP[this.inputType],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodValueTypes(): CoCo.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCoCoEventParamValueTypes(): CoCo.EventParamValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProjectPropValueTypes(): CreationProject.PropValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: CREATION_PROJECT_VALUE_TYPE_MAP[this.inputType],
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(): CreationProject.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProjectEmitParamValueTypes(): CreationProject.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }
}
