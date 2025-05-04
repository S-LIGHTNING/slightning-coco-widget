import { getDefaultAdapter } from "../adapters/adapter"

export function emit(this: {}, key: string, ...args: unknown[]): void {
    getDefaultAdapter().emit.call(this, key, ...args)
}
