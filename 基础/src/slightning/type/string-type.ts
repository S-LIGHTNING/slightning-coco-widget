import packageInfo from "../../../package.json"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { XMLEscape } from "../../utils"
import { RuntimeStringType } from "../runtime/type/string-type"
import { ChildTypeInfo, RuntimeTypeData, Type } from "./type"
import { typeGenerateRuntimeData } from "./utils"

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

const CREATION_PROJECT_1_VALUE_TYPE_MAP: Record<StringInputType, CreationProject1.ValueType> = {
    [StringInputType.INLINE]: "string",
    [StringInputType.MULTILINE]: "multiline_string",
    [StringInputType.RICH]: "multiline_string"
}

const CREATION_PROJECT_2_VALUE_TYPE_MAP: Record<StringInputType, CreationProject2.ValueType> = {
    [StringInputType.INLINE]: "string",
    [StringInputType.MULTILINE]: "multilineString",
    [StringInputType.RICH]: "multilineString"
}

export class StringType extends RuntimeStringType implements Type<string> {

    public readonly key: string = "StringType"
    public readonly defaultValue: string
    public readonly inputType: StringInputType

    public constructor(defaultValue: string)
    public constructor(props?: {
        defaultValue?: string | null | undefined
        inputType?: StringInputType | null | undefined
    } | null | undefined)
    public constructor(props?: {
        defaultValue?: string | null | undefined
        inputType?: StringInputType | null | undefined
    } | string | null | undefined) {
        super()
        if (props == null) {
            props = {}
        } else if (typeof props == "string") {
            props = { defaultValue: props }
        }
        this.defaultValue = props.defaultValue ?? ""
        this.inputType = props.inputType ?? StringInputType.INLINE
    }

    public toJSON(this: this): RuntimeTypeData {
        return typeGenerateRuntimeData(packageInfo.name, "RuntimeStringType", {})
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

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        return {
            valueType: "string",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: CREATION_PROJECT_1_VALUE_TYPE_MAP[this.inputType],
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        return {
            valueType: CREATION_PROJECT_2_VALUE_TYPE_MAP[this.inputType],
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: CREATION_PROJECT_2_VALUE_TYPE_MAP[this.inputType],
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "string"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "string"
        }
    }
}
