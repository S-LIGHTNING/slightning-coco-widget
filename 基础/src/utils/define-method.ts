export function defineMethod(object: {}, key: string, value: (...args: any[]) => any): void {
    Object.defineProperty(object, key, {
        value,
        writable: true,
        enumerable: false,
        configurable: true
    })
}
