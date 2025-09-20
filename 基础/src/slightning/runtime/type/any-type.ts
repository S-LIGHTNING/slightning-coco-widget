import { RuntimeType } from "./type"

export class RuntimeAnyType implements RuntimeType<any> {

    public validate(this: this, __value: unknown): __value is any {
        return true
    }

    public typeToString(this: this): string {
        return "任意"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }
}
