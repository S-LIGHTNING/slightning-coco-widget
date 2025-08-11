import { setDefaultAdapter } from "./adapters/adapter"
import { CoCoAdapter } from "./adapters/coco"
import * as CoCo from "../coco"
import * as CreationProject1 from "../creation-project-1"
import * as CreationProject2 from "../creation-project-1"
import { CreationProject1Adapter } from "./adapters/creation-project-1"
import { CreationProject2Adapter } from "./adapters/creation-project-2"

if (
    typeof CreationProject1.widgetClass != "undefined" &&
    typeof CreationProject1.widgetRequire == "function" &&
    ((): boolean => {
        try {
            CreationProject1.widgetRequire("cp_utils")
        } catch (__ignore) {
            return false
        }
        return true
    })()
) {
    setDefaultAdapter(CreationProject1Adapter)
} else if (
    typeof CreationProject2.widgetClass != "undefined" &&
    typeof CreationProject2.widgetRequire == "function" &&
    ((): boolean => {
        try {
            CreationProject1.widgetRequire("cp_utils")
        } catch (__ignore) {
            return true
        }
        return false
    })()
) {
    setDefaultAdapter(CreationProject2Adapter)
} else if (
    typeof CoCo.InvisibleWidget != "undefined" &&
    typeof CoCo.VisibleWidget != "undefined"
) {
    setDefaultAdapter(CoCoAdapter)
} else if (
    (new Function("return typeof global"))() != "undefined" &&
    (new Function("return typeof process"))() != "undefined"
) {
    throw new Error("暂不支持在 Node 中运行")
} else {
    throw new Error(`未知的平台：${location.href}`)
}

export * from "./types"
export * from "./type"
export * from "./widget"
export * from "./export"
export * from "./decorators"
export * from "./convert"
export * from "./utils"
