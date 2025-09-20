export function excludeBoolean<T>(value: T | boolean): T | null {
    if (typeof value == "boolean") {
        return null
    }
    return value
}
