import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { betterToString } from "../../utils"
import { ChildTypeInfo, Type } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export enum StringEnumInputType {
    DROPDOWN = "INLINE",
    OPTION_SWITCH = "OPTION_SWITCH"
}

type StandardEntry<T extends string> = { label: string, value: T }

type Entry<T extends string> = ({ label: string, value: T } | [string, T] | T)

export class StringEnumType<T extends string> implements Type<T> {

    public readonly entries: StandardEntry<T>[]
    public readonly inputType: StringEnumInputType
    public readonly valueToLabelMap: Record<T, string>
    public readonly values: T[]

    public constructor(entries: Entry<T>[])
    public constructor(props: {
        entries: Entry<T>[]
        inputType?: StringEnumInputType | null | undefined
    } | Entry<T>[])
    public constructor(props: {
        entries: Entry<T>[]
        inputType?: StringEnumInputType | null | undefined
    } | Entry<T>[]) {
        if (Array.isArray(props)) {
            props = { entries: props }
        }
        this.entries = props.entries.map((entry: Entry<T>): StandardEntry<T> => {
            if (typeof entry == "string") {
                return { label: entry, value: entry }
            } else if (Array.isArray(entry)) {
                return { label: entry[0], value: entry[1] }
            } else {
                return entry
            }
        })
        this.inputType = props.inputType ?? StringEnumInputType.DROPDOWN
        // @ts-ignore
        this.valueToLabelMap = {}
        for (const entry of this.entries) {
            this.valueToLabelMap[entry.value] = entry.label
        }
        this.values = this.entries.map((entry: StandardEntry<T>): T => entry.value)
    }

    public validate(this: this, value: unknown): value is T {
        // @ts-ignore
        if (typeof value != "string" || !this.values.includes(value)) {
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
        return this.entries.length != 0
    }

    public typeToString(this: this): string {
        return this.values.length == 0 ? "空" : `(${this.values.map(
            (value: string): string => JSON.stringify(value)
        ).join(" | ")})`
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }

    public toCoCoPropertyValueTypes(this: this): CoCo.PropertyValueTypes {
        return {
            editorType: this.inputType == StringEnumInputType.DROPDOWN ? undefined : "OptionSwitch",
            dropdown: this.entries
        }
    }

    public toCoCoMethodParamValueTypes(this: this): CoCo.MethodParamValueTypes {
        return {
            dropdown: this.entries
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
            valueType: "dropdown",
            dropdown: this.entries.map(
                (entry: { label: string, value: string }): [string, string] =>
                    [entry.label, entry.value]
            )
        }
    }

    public toCreationProject1MethodParamValueTypes(this: this): CreationProject1.MethodParamValueTypes {
        return {
            valueType: "dropdown",
            dropdown: this.entries.map(
                (entry: { label: string, value: string }): [string, string] =>
                    [entry.label, entry.value]
            )
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
            valueType: "dropdown",
            dropdown: this.entries.map(
                (entry: { label: string, value: string }): [string, string] =>
                    [entry.label, entry.value]
            )
        }
    }

    public toCreationProject2MethodParamValueTypes(this: this): CreationProject2.MethodParamValueTypes {
        return {
            valueType: "dropdown",
            dropdown: this.entries.map(
                (entry: { label: string, value: string }): [string, string] =>
                    [entry.label, entry.value]
            )
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
