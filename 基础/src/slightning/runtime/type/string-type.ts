import { betterToString } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export class RuntimeStringType implements RuntimeType<string> {

    public validate(this: this, value: unknown): value is string {
        if (typeof value != "string") {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public typeToString(this: this): string {
        return "字符串"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }
}
