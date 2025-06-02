import * as stringify from "@slightning/anything-to-string"

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

export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function excludeBoolean<T>(value: T | boolean): T | null {
    if (typeof value == "boolean") {
        return null
    }
    return value
}

export function XMLEscape(text: string): string {
    const element: HTMLElement = document.createElement("div")
    element.innerText = text
    return element.innerHTML
}

export function addMessageToError(message: string, error: unknown): unknown {
    if (typeof error == "string") {
        return `${message}：${error}`
    } else if (Array.isArray(error)) {
        return [message, ...error]
    } else {
        return [message, error]
    }
}

export function errorToArray(error: unknown): unknown[] {
    if (Array.isArray(error)) {
        return error
    } else {
        return [error]
    }
}

export function betterToString(data: unknown): string {
    return stringify.default(data, {
        rules: stringify.Rules.LESSER,
        indent: "　",
        depth: 2
    })
}

export function CoCoLogToLineArray(message: string): string[] {
    let lineArray: string[] = message.split("\n")
    if (lineArray.length > 1) {
        lineArray[0] = `┼　${lineArray[0]}`
        for (let i: number = 1; i < lineArray.length; i++) {
            lineArray[i] = `│　${lineArray[i]}`
        }
    }
    return lineArray
}

export class Range {

    public constructor(
        public left: number | [number],
        public right: number | [number]
    ) {}

    public includes(value: number): boolean {
        if (Array.isArray(this.left)) {
            if (value < this.left[0]) {
                return false
            }
        } else if (value <= this.left) {
            return false
        }
        if (Array.isArray(this.right)) {
            if (value > this.right[0]) {
                return false
            }
        } else if (value >= this.right) {
            return false
        }
        return true
    }

    public toString(): string {
        let result: string = ""
        if (Array.isArray(this.left)) {
            result += "[" + this.left[0]
        } else {
            result += "(" + this.left
        }
        result += ","
        if (Array.isArray(this.right)) {
            result += this.right[0] + "["
        } else {
            result += this.right + ")"
        }
        return result
    }
}
