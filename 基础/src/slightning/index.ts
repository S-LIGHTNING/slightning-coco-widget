import { setDefaultAdapter } from "./adapters/adapter"
import { CoCoAdapter } from "./adapters/coco"
import * as CoCo from "../coco"
import * as CreationProject from "../creation-project"
import { CreationProjectAdapter } from "./adapters/creation-project"

if (
    typeof CreationProject.widgetClass != "undefined" &&
    typeof CreationProject.widgetRequire == "function" &&
    CreationProject.widgetRequire("cp_utils") != null
) {
    setDefaultAdapter(CreationProjectAdapter)
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
