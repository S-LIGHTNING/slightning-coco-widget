import { getDefaultAdapter } from "../adapters/adapter"

export const eventKeyMap: Record<string, string> = {}

export function emit(this: {}, key: string, ...args: unknown[]): void {
    key = eventKeyMap[key] ?? key
    getDefaultAdapter().emit.call(this, key, ...args)
}
