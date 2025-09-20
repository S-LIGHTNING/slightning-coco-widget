import { RuntimeType } from "./type"

export class TypeValidateError<T> extends Error {

    public readonly value: unknown
    public readonly type: RuntimeType<T>

    public constructor(message: string, value: unknown, type: RuntimeType<T>) {
        super(message)
        this.value = value
        this.type = type
    }
}
