export function errorToArray(error: unknown): unknown[] {
    if (Array.isArray(error)) {
        return error
    } else {
        return [error]
    }
}
