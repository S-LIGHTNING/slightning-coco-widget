import { Utils } from "../utils/utils"
import * as CoCo from "../../coco"
import * as CreationProject1 from "../../creation-project-1"
import * as CreationProject2 from "../../creation-project-2"
import { CoCoAdapter } from "./coco"
import { CreationProject1Adapter } from "./creation-project-1"
import { CreationProject2Adapter } from "./creation-project-2"
import type { crossPlatform } from "../runtime/cross-platform"

/**
 * @deprecated 适配器模式已弃用，请使用 {@link crossPlatform} 替代。
 */
export interface Adapter {
    utils: Utils
}

let defaultAdapter: Adapter | null = null

/**
 * @deprecated 适配器模式已弃用，请使用 {@link crossPlatform} 替代。
 */
export function getDefaultAdapter(): Adapter {
    if (defaultAdapter == null) {
        setDefaultAdapter()
    }
    return defaultAdapter!
}

/**
 * @deprecated 适配器模式已弃用，请使用 {@link crossPlatform} 替代。
 */
export function setDefaultAdapter(adapter?: Adapter | null | undefined): void {
    if (adapter == null) {
        if (defaultAdapter == null) {
            if (
                typeof CreationProject1.widgetClass != "undefined" &&
                typeof CreationProject1.widgetRequire == "function" &&
                ((): CreationProject1.Utils | null => {
                    try {
                        return CreationProject1.widgetRequire("cp_utils")
                    } catch (__ignore) {
                        return null
                    }
                })() != null &&
                ((): typeof import("@ant-design/icons-vue") | null => {
                    try {
                        return CreationProject1.widgetRequire("@ant-design/icons-vue")
                    } catch (__ignore) {
                        return null
                    }
                })() != null
            ) {
                defaultAdapter = CreationProject1Adapter
            } else if (
                typeof CreationProject2.widgetClass != "undefined" &&
                typeof CreationProject2.widgetRequire == "function" &&
                ((): unknown | null => {
                    try {
                        // @ts-ignore
                        return CreationProject2.widgetRequire("@ant-design/icons-vue")
                    } catch (__ignore) {
                        return null
                    }
                })() == null
            ) {
                defaultAdapter = CreationProject2Adapter
            } else if (
                typeof CoCo.InvisibleWidget != "undefined" &&
                typeof CoCo.VisibleWidget != "undefined"
            ) {
                defaultAdapter = CoCoAdapter
            } else if (
                (new Function("return typeof global"))() != "undefined" &&
                (new Function("return typeof process"))() != "undefined"
            ) {
                throw new Error("暂不支持在 Node 中运行")
            } else {
                throw new Error(`未知的平台：${location.href}`)
            }
        }
    } else {
        defaultAdapter = adapter
    }
}
