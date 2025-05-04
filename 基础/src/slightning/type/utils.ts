import { betterToString } from "../../utils"
import { Type } from "./type"
import { TypeValidateError } from "./type-validate-error"

export function validate<T>(name: string | null, value: unknown, type: Type<T>): value is T {
    let message: string | null = null, result: boolean = false
    try {
        result = type.validate(value)
    } catch (error) {
        if (!(error instanceof TypeValidateError)) {
            throw error
        }
        message = error.message
    }
    if (!result && message == null) {
        message = `不能将 ${betterToString(value)} 分配给 ${type.toString()}`
    }
    if (message != null) {
        if (name != null) {
            message = `${name}：${message}`
        }
        throw new TypeValidateError<T>(message, value, type)
    }
    return true
}
