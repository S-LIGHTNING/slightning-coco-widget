import { betterToString } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export interface RuntimeStringEnumTypeProps<T extends string> {
    valueToLabelMap: Record<T, string>
}

export class RuntimeStringEnumType<T extends string = string> implements RuntimeType<T> {

    public readonly valueToLabelMap: Record<T, string>
    public readonly values: T[]

    public constructor({ valueToLabelMap }: RuntimeStringEnumTypeProps<T>) {
        this.valueToLabelMap = valueToLabelMap
        this.values = Object.keys(valueToLabelMap) as T[]
    }

    public validate(this: this, value: unknown): value is T {
        if (typeof value != "string" || !Object.prototype.hasOwnProperty.call(this.valueToLabelMap, value)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public typeToString(this: this): string {
        return this.values.length == 0 ? "空" : `(${this.values.map(
            (value: string): string => JSON.stringify(value)
        ).join(" | ")})`
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }
}
