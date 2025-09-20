import { betterToString, Range } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export interface RuntimeIntegerTypeProps {
    range?: Range | null | undefined
}

export class RuntimeIntegerType implements RuntimeType<number> {

    public readonly range: Range | null | undefined

    public constructor({ range }: RuntimeIntegerTypeProps) {
        this.range = range
    }

    public validate(this: this, value: unknown): value is number {
        if (typeof value != "number" || !Number.isInteger(value)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        if (this.range != null && !this.range.includes(value)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}：整数超出范围`, value, this)
        }
        return true
    }

    public typeToString(this: this): string {
        return "整数"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }
}
