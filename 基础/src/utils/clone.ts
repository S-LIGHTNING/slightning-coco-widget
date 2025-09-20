export function clone<T>(data: T, costume?: ((data: unknown) => unknown) | null | undefined): T {
    if (costume != null) {
        try {
            return costume(data) as T
        } catch (error) {
            if (!(error instanceof UseDefaultClone)) {
                throw error
            }
        }
    }
    if (Array.isArray(data)) {
        const result = []
        for (let i = 0; i < data.length; i++) {
            result[i] = clone(data[i], costume)
        }
        return result as T
    } if (data != null && typeof data == "object") {
        const result: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(data)) {
            result[key] = clone(value, costume)
        }
        return result as T
    }
    return data
}

export class UseDefaultClone extends Error {}
