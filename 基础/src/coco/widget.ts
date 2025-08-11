import type { ReactNode } from "react"

export type Utils = {

    /**
     * 判断宿主是否为客户端
     *
     * @returns 打包后的 App 中返回 true，其它场景下返回 false
     */
    isNative(): boolean

    /**
     * 通过文件名获取素材库中对应文件的链接
     *
     * @param fileName 素材库中该素材的文件名
     *
     * @returns 素材库中对应文件的链接
     */
    getWidgetImageUrl(fileName: string): string
}

declare function __slightning_coco_widget_require__(moduleName: "utils"): Utils | undefined
declare function __slightning_coco_widget_require__(moduleName: "vika"): typeof import("@vikadata/vika") | undefined
declare function __slightning_coco_widget_require__(moduleName: "axios"): typeof import("axios-0.21.1") | undefined
declare function __slightning_coco_widget_require__(moduleName: "lodash"): typeof import("lodash") | undefined
declare function __slightning_coco_widget_require__(moduleName: "crypto-js"): typeof import("crypto-js") | undefined
declare function __slightning_coco_widget_require__(moduleName: "qrcode"): typeof import("qrcode") | undefined
declare function __slightning_coco_widget_require__(moduleName: "color"): typeof import("color") | undefined
declare function __slightning_coco_widget_require__(moduleName: "http"): any | undefined
declare function __slightning_coco_widget_require__(moduleName: "websocket"): typeof WebSocket | undefined
declare function __slightning_coco_widget_require__(moduleName: "pedometer"): any | undefined
declare function __slightning_coco_widget_require__(moduleName: "brightness"): any | undefined
declare function __slightning_coco_widget_require__(moduleName: "stepper"): any | undefined
declare function __slightning_coco_widget_require__(moduleName: "antd-mobile"): typeof import("antd-mobile") | undefined
declare function __slightning_coco_widget_require__(moduleName: "html2canvas"): typeof import("html2canvas") | undefined

export const widgetRequire: typeof __slightning_coco_widget_require__ = __slightning_coco_widget_require__

export interface Widget {
    widgetLog(this: this, message: string): void
    widgetWarn(this: this, message: string): void
    widgetError(this: this, message: string): void
    emit(this: this, key: string, ...args: unknown[]): void
}

declare class InvisibleWidget implements Widget {
    public constructor(props: Record<string, any>)
    public widgetLog(this: this, message: string): void
    public widgetWarn(this: this, message: string): void
    public widgetError(this: this, message: string): void
    public widgetInterrupt(this: this, message: string): void
    public emit(this: this, key: string, ...args: unknown[]): void
}

declare class VisibleWidget implements Widget {
    public constructor(props: Record<string, any>)
    public widgetLog(this: this, message: string): void
    public widgetWarn(this: this, message: string): void
    public widgetError(this: this, message: string): void
    public setProps(this: this, props: Record<string, unknown>): void
    public emit(this: this, key: string, ...args: unknown[]): void
    public render(this: this): ReactNode
}

const __InvisibleWidget: typeof InvisibleWidget = InvisibleWidget
type __InvisibleWidget = InvisibleWidget
const __VisibleWidget: typeof VisibleWidget = VisibleWidget
type __VisibleWidget = VisibleWidget

export {
    __InvisibleWidget as InvisibleWidget,
    __VisibleWidget as VisibleWidget
}
