import { RuntimeType } from "./type"

export class RuntimeVoidType implements RuntimeType<void> {

    public validate(this: this, __value: unknown): __value is void {
        return true
    }

    public typeToString(this: this): string {
        return "空"
    }

    public inlineTypeToString(this: this): string {
        return this.typeToString()
    }
}
