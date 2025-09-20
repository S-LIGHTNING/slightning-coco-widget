import packageInfo from "../../../package.json"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { requireStringify, XMLEscape } from "../../utils"
import { ChildTypeInfo, RuntimeTypeData, Type } from "./type"
import { typeGenerateRuntimeData } from "./utils"
import { RuntimeArrayType } from "../runtime/type/array-type"
import { inlineTypeToString } from "../runtime/type/utils"

export class ArrayType<T> extends RuntimeArrayType<T> implements Type<T[]> {

    public readonly key: string = "ArrayType"
    public override readonly itemType: Type<T> | null | undefined
    public readonly defaultValue?: T[] | string

    public constructor(props?: {
        itemType?: Type<T> | null | undefined
        defaultValue?: T[] | string | null | undefined
    } | null | undefined) {
        super(props ?? {})
        requireStringify()
        this.defaultValue = props?.defaultValue ?? inlineTypeToString(this)
    }

    public toJSON(this: this): RuntimeTypeData {
        return typeGenerateRuntimeData(packageInfo.name, "RuntimeArrayType", {
            itemType: this.itemType?.toJSON()
        })
    }

    public getSameDirectionChildren(this: this): ChildTypeInfo[] {
        return this.itemType == null ? [] : [{
            key: "__slightning_coco_widget_array_item__",
            label: "数组项",
            type: this.itemType as Type<T>
        }]
    }

    public getReverseDirectionChildren(this: this): ChildTypeInfo[] {
        return []
    }

    public isVoid(this: this): boolean {
        return false
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            valueType: ["string", "array"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            valueType: ["string", "array"],
            checkType: "string",
            defaultValue: XMLEscape(typeof this.defaultValue == "string" ? this.defaultValue : JSON.stringify(this.defaultValue))
        }
    }

    public toCoCoMethodValueTypes(this: this): CoCo.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCoCoEventParamValueTypes(this: this): CoCo.EventParamValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject1PropValueTypes(this: this): CreationProject1.PropValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject1MethodValueTypes(this: this): CreationProject1.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject1EmitParamValueTypes(this: this): CreationProject1.EmitParamValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject2PropValueTypes(this: this): CreationProject2.PropValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: "array",
            defaultValue: this.defaultValue
        }
    }

    public toCreationProject2MethodValueTypes(this: this): CreationProject2.MethodValueTypes {
        return {
            valueType: "array"
        }
    }

    public toCreationProject2EmitParamValueTypes(this: this): CreationProject2.EmitParamValueTypes {
        return {
            valueType: "array"
        }
    }
}
