import type * as CryptoJS from "crypto-js"
import type * as axios from "axios-1.7.4"
import type * as Vue from "vue"
import type * as AntDesign_IconsVue from "@ant-design/icons-vue"
import type * as Vika from "@vikadata/vika"
import type * as Lodash from "lodash"
import type * as html2canvas from "html2canvas"

export type Utils = {

    /**
     * 判断是否在 打包后的应用 上运行
     */
    native: boolean

    /**
     * 判断是否是 运行模式
     */
    player: boolean

    resToUrl: {

        /**
         * 图片标识 转换成 链接。如果不存在，返回null
         *
         * @param key 图片标识
         *
         * @returns 素材库中对应文件的链接。如果不存在，则为null
         */
        img(key: string): string | null

        /**
         * 音频标识 转换成 链接。如果不存在，返回null
         *
         * @param key 音频标识
         *
         * @returns 素材库中对应文件的链接。如果不存在，则为null
         */
        audio(key: string): string | null

        /**
         * 视频标识 转换成 链接。如果不存在，返回null
         *
         * @param key 视频标识
         *
         * @returns 素材库中对应文件的链接。如果不存在，则为null
         */
        video(key: string): string | null
    }
}

declare function __slightning_coco_widget_require__(moduleName: "cp_utils"): Utils
declare function __slightning_coco_widget_require__(moduleName: "crypto-js"): typeof CryptoJS
declare function __slightning_coco_widget_require__(moduleName: "axios"): typeof axios
declare function __slightning_coco_widget_require__(moduleName: "vue"): typeof Vue
declare function __slightning_coco_widget_require__(moduleName: "@ant-design/icons-vue"): typeof AntDesign_IconsVue
declare function __slightning_coco_widget_require__(moduleName: "vika"): typeof Vika
declare function __slightning_coco_widget_require__(moduleName: "lodash"): typeof Lodash
declare function __slightning_coco_widget_require__(moduleName: "html2canvas"): typeof html2canvas

export const widgetRequire: typeof __slightning_coco_widget_require__ = __slightning_coco_widget_require__

const __widgetClass: typeof widgetClass = widgetClass
type __widgetClass = widgetClass

export {
    __widgetClass as widgetClass
}

/**
 * 以下内容来自 https://www.yuque.com/zaona/cp/widget_apis#nC37P，有修改。
 */

import { PropTypes, Types } from "./type"

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
    _widgetType: null | Types;
    _setProp: null | ((key: string, value: any, raw?: boolean) => void);
    _editorSetProp: null | ((key: string, value: any, raw?: boolean) => void);
    props: Record<string, any>;
    _id: string | null;
    _screen: string[];
    __emits: Record<string, ((...arg: any[]) => any)[]>;
    [key: string]: any;
    constructor(arg?: any);
    render(): any;
    _onNameChange(name: string): void;
    _afterEntityInit(): void;
    _afterScreenInit(screenId: string): void;
    _saveWidgetType(wt: Types): void;
    _saveSetProp(setProp: (key: string, value: any) => void): void;
    _parseProps(props: Record<string, any>): void;
    setProp(key: string, value: any): void;
    _getDefaultProps(): Record<string, any>;
    _getBlocklyBlockDef(_widgetType: Types): any;
    _getBlocklyFlyoutDef(widgetType: Types, key: string): any;
    _builtin_props(): {
        beforeProps: PropTypes[];
        afterProps: PropTypes[];
    };
    _set_builtin_method(oldWidgetType: Types): Types;
    __setPos(posType: 'left' | 'top', posNumber: number): void;
    __getPos(posType: 'left' | 'top'): any;
    __setSize(sizeType: 'width' | 'height', sizeNumber: number): void;
    __getSize(sizeType: 'width' | 'height'): any;
    _preprocessed_widgetType(oldWidgetType: Types): Types;
    _callMethod(execProp: execProp, entityData: unknown, screenId: string): Promise<any>;
    emit(emitKey: string, ...arg: any[]): Promise<void>;
    _render(): any;
    toJSON(): (string | string[] | Record<string, any> | Types | ((key: string, value: any, raw?: boolean) => void))[];
    widgetLog(...arg: any[]): void;
    widgetWarn(...arg: any[]): void;
    widgetError(...arg: any[]): void;
    widgetInfo(...arg: any[]): void;
}
