declare function __slightning_coco_widget_require__(moduleName: "crypto-js"): typeof import("crypto-js")
declare function __slightning_coco_widget_require__(moduleName: "axios"): typeof import("axios-1.7.4")
declare function __slightning_coco_widget_require__(moduleName: "vue"): typeof import("vue")
declare function __slightning_coco_widget_require__(moduleName: "vika"): typeof import("@vikadata/vika")
declare function __slightning_coco_widget_require__(moduleName: "lodash"): typeof import("lodash")
declare function __slightning_coco_widget_require__(moduleName: "html2canvas"): typeof import("html2canvas")

export const widgetRequire: typeof __slightning_coco_widget_require__ = __slightning_coco_widget_require__

const __widgetClass: typeof widgetClass = widgetClass
type __widgetClass = widgetClass

export { __widgetClass as widgetClass }

/**
 * 以下内容来自 https://www.yuque.com/zaona/cp/widget_apis_v1#nC37P，有修改。
 */

export interface execProp extends Record<string, any> {
    WIDGET_ID: string;
    METHOD: string;
    STATIC?: string;
    WIDGET_TYPE?: string;
    PARAMS: [
        string,
        (...arg: any[]) => any,
        {
            runtimeFn?: boolean;
            valueType: string;
            cclType?: string;
        }
    ][];
    BLOCK: string;
}

declare class widgetClass {
    props: Record<string, any>;
    _id: string;
    setProp(key: string, value: any): void;
    emit(emitKey: string, ...arg: any[]): Promise<void>;
    widgetLog(...arg: any[]): void;
    widgetWarn(...arg: any[]): void;
    widgetError(...arg: any[]): void;
    widgetInfo(...arg: any[]): void;
}
