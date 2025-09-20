export function defineProperty(object: {}, key: string, value: unknown): void {
    Object.defineProperty(object, key, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
    })
}
