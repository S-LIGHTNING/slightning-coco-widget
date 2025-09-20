import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"

export type StandardPlatform = "CoCo" | "CreationProject1" | "CreationProject2" | "NodeJS"

export function crossPlatform<T>(multi: Record<StandardPlatform, T>): T {
    return multi[getPlatform()]
}

let platform: StandardPlatform | Error | null = null

export function getPlatform(): StandardPlatform {
    if (platform == null) {
        if (
            [CreationProject1.widgetClass, CreationProject1.widgetRequire].every(isFunction) &&
            hasPackages(CreationProject1.widgetRequire as (id: string) => unknown, "cp_utils", "@ant-design/icons-vue")
        ) {
            platform = "CreationProject1"
        } else if (
            [CreationProject2.widgetClass, CreationProject2.widgetRequire].every(isFunction) &&
            hasPackages(CreationProject2.widgetRequire as (id: string) => unknown, "@ant-design/icons-vue")
        ) {
            platform = "CreationProject2"
        } else if ([CoCo.InvisibleWidget, CoCo.VisibleWidget].every(isFunction)) {
            platform = "CoCo"
        } else if (["global", "process"].every(globalRealHas)) {
            platform = "NodeJS"
        } else {
            platform = new Error(`未知的平台${typeof location != "undefined" ? `：${location.href}` : ""}`)
        }
    }
    if (platform instanceof Error) {
        throw platform
    }
    return platform
}

function globalRealHas(key: string): boolean {
    return (new Function(`return typeof ${key}`))() != "undefined"
}

function isFunction(value: unknown): value is Function {
    return typeof value == "function"
}

function hasPackages(require: (id: string) => unknown, ...ids: string[]): boolean {
    try {
        return ids.every(require)
    } catch {
        return false
    }
}
