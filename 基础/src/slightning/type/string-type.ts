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

    public constructor(defaultValue: string)
    public constructor(props?: {
        defaultValue?: string | null | undefined
        inputType?: StringInputType | null | undefined
    } | string)
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

    public validate(this: this, value: unknown): value is string {
        if (typeof value != "string") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return false
    }

    public typeToString(this: this): string {
        return "字符串"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            editorType: COCO_EDITOR_TYPE_MAP[this.inputType],
            valueType: "string",
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: COCO_VALUE_TYPE_MAP[this.inputType],
            checkType: "string",
            defaultValue: XMLEscape(this.defaultValue)
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProjectPropValueTypes(this: this): CreationProject.PropValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodParamValueTypes(this: this): CreationProject.MethodParamValueTypes {
        return {
            valueType: CREATION_PROJECT_VALUE_TYPE_MAP[this.inputType],
            defaultValue: this.defaultValue
        }
    }

    public toCreationProjectMethodValueTypes(this: this): CreationProject.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProjectEmitParamValueTypes(this: this): CreationProject.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }
}
