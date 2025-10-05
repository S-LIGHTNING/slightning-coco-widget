export let stringify: typeof import("@slightning/anything-to-string")

export function setStringify(value: typeof stringify): void {
    stringify = value
}

export function loadStringify() {
    return import(/* webpackMode: "inline" */ "@slightning/anything-to-string").then(setStringify)
}

export function betterToString(data: unknown): string {
    if (stringify == undefined) {
        return "@slightning/anything-to-string 未加载或加载失败"
    }
    return stringify.default(data, {
        rules: stringify.Rules.LESSER,
        indent: "　",
        depth: 2
    })
}
