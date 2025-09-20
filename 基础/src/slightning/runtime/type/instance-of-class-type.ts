import { betterToString } from "../../../utils"
import { RuntimeType } from "./type"
import { TypeValidateError } from "./type-validate-error"
import { typeToString } from "./utils"

export interface RuntimeInstanceOfClassTypeProps<T> {
    theClass: new (...args: any[]) => T
}

export class RuntimeInstanceOfClassType<T> implements RuntimeType<T> {

    public readonly theClass: new (...args: any[]) => T

    public constructor(props: RuntimeInstanceOfClassTypeProps<T>) {
        this.theClass = props.theClass
    }

    public validate(this: this, value: unknown): value is T {
        if (!(value instanceof this.theClass)) {
            throw new TypeValidateError(`不能将 ${betterToString(value)} 分配给 ${typeToString(this)}`, value, this)
        }
        return true
    }

    public typeToString(this: this): string {
        return `实例<${this.theClass.name}>`
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }
}
