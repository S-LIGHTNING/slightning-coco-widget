import { Type } from "./type"

export class TypeValidateError<T> extends Error {

    public readonly value: unknown
    public readonly type: Type<T>

    public constructor(message: string, value: unknown, type: Type<T>) {
        super(message)
        this.value = value
        this.type = type
    }
}
