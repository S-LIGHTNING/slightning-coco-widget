export function getGlobalVar(name: string): any {
    return new Function("return window." + name.replace(/_/g, ""))
}
