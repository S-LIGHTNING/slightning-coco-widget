import * as CoCo from "../../coco"
import * as CreationProject from "../../creation-project"
import { betterToString } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export enum StringEnumInputType {
    DROPDOWN = "INLINE",
    OPTION_SWITCH = "OPTION_SWITCH"
}

export class StringEnumType<T extends string> implements Type<T> {

    public readonly entries: { label: string, value: string }[]
    public readonly inputType: StringEnumInputType
    public readonly valueToLabelMap: Record<string, string>
    public readonly values: string[]

    public constructor({
        entries, inputType
    }: {
        entries: { label: string, value: string }[]
        inputType?: StringEnumInputType | null | undefined
    }) {
        this.entries = entries
        this.inputType = inputType ?? StringEnumInputType.DROPDOWN
        this.valueToLabelMap = {}
        for (const entry of entries) {
            this.valueToLabelMap[entry.value] = entry.label
        }
        this.values = entries.map((entry: { label: string, value: string }): string => entry.value)
    }

    public validate(value: unknown): value is T {
        if (typeof value != "string" || !this.values.includes(value)) {
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
            editorType: this.inputType == StringEnumInputType.DROPDOWN ? undefined : "OptionSwitch",
            dropdown: this.entries
        }
    }

    public toCoCoMethodParamValueTypes(): CoCo.MethodParamValueTypes {
        return {
            dropdown: this.entries
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
            valueType: "dropdown",
            dropdown: this.entries.map(
                (entry: { label: string, value: string }): [string, string] =>
                    [entry.label, entry.value]
            )
        }
    }

    public toCreationProjectMethodParamValueTypes(): CreationProject.MethodParamValueTypes {
        return {
            valueType: "dropdown",
            dropdown: this.entries.map(
                (entry: { label: string, value: string }): [string, string] =>
                    [entry.label, entry.value]
            )
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
