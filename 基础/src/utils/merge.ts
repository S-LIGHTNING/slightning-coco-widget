export function merge<T extends {}>(target: T): T
export function merge<T extends {}, U extends {}>(target: T, source: U): T & U
export function merge<T extends {}, U extends {}, V extends {}>(target: T, source0: U, source1: V): T & U & V
export function merge<T extends {}, U extends {}, V extends {}, W extends {}>(target: T, source0: U, source1: V, source2: W): T & U & V & W
export function merge(target: any, ...sources: any[]): any {
    for (const source of sources) {
        for (const [key, value] of Object.entries(source)) {
            if (Array.isArray(value)) {
                if (!Array.isArray(target[key])) {
                    target[key] = []
                }
                target[key] = target[key].push(...value)
            } else if (value != null && typeof value == "object") {
                if (target[key] == null || typeof target[key] != "object") {
                    target[key] = {}
                }
                merge(target[key], value)
            } else {
                target[key] = value
            }
        }
    }
    return target
}
