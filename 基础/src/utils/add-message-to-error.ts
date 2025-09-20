export function addMessageToError(message: string, error: unknown): unknown {
    if (typeof error == "string") {
        return `${message}：${error}`
    } else if (Array.isArray(error)) {
        return [message, ...error]
    } else {
        return [message, error]
    }
}
