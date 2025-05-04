import { Type } from "./type"

export interface Types {
    /**
     * 全局唯一控件类型。
     *
     * 命名规范：仅由大写英文字母加下划线组成。
     */
    type: string
    info: {
        /**
         * 控件名称。
         *
         * 会在 CoCo 编辑器显示。
         */
        title: string
        /**
         * 控件图标链接。
         *
         * 控件图标会在 CoCo 编辑器显示。
         *
         * 一般使用 SVG。
         */
        icon: string
        /**
         * 控件分类。
         *
         * **仅在 Creation Project 中生效，CoCo 不支持该特性。**
         */
        category?: string | null | undefined
        /**
         * 控件版本。
         *
         * 推荐使用语义化版本：https://semver.org/lang/zh-CN/。
         */
        version?: `${number}.${number}.${number}` | string | null | undefined
        url?: {
            /**
             * 控件主页链接。
             */
            homepage?: string | null | undefined
            /**
             * 控件文档链接。
             *
             * 设置后可在控件属性面板下方点击“如何使用？”跳转到文档。
             */
            docs?: string | null | undefined
            /**
             * 控件代码仓库链接。
             */
            repository?: string | null | undefined
            /**
             * 控件问题报告链接。
             */
            bugReport?: string | null | undefined
        } | null | undefined
    }
    options: {
        /**
         * 是否是可见控件。
         */
        visible: boolean
        /**
         * 是否是全局控件。
         */
        global: boolean
        /**
         * 是否是静态控件。
         *
         * **仅在 Creation Project 中生效，CoCo 不支持该特性。**
         *
         * 静态控件特性：
         *
         * - 引入后会自动添加到作品内，不会显示在控件栏；
         *
         * - 属性相关积木将不会添加“设置 [控件名]”或“获取 [控件名]”前缀；
         *
         * - 事件积木 将不会添加“当 [控件名]”前缀。
         */
        static?: boolean | null | undefined
        /**
         * 控件的可用平台。
         */
        platforms?: Platforms | null | undefined
        /**
         * 是否生成任意控件积木。
         *
         * **仅在 CoCo 中生效，Creation Project 不支持该特性。**
         */
        any?: boolean | null | undefined
    }
    properties: PropertiesTypes
    methods: MethodsTypes
    events: EventTypes[]
}

export type Platforms = PlatformEnum[]

export enum PlatformEnum {
    /**
     * 网页（编辑器、h5 预览、社区分享）。
     */
    WEB = "web",
    /**
     * 安卓手机端。
     */
    ANDROID = "android",
    /**
     * iOS 端（iPhone，iPad 等）
     */
    IOS = "ios"
}

export type PropertiesTypes = (PropertyGroup | PropertyTypes)[]

export interface PropertyGroup {
    label?: string | null | undefined
    blockOptions?: PropertyBlockOptionsTypes | null | undefined
    contents: PropertiesTypes
}

export interface PropertyTypes {
    key: string
    label: string
    type: Type
    blockOptions?: PropertyBlockOptionsTypes | null | undefined
}

export interface PropertyBlockOptionsTypes {
    get?: boolean | PropertyComputeBlockOptionsTypes | null | undefined
    set?: boolean | PropertyComputeBlockOptionsTypes | null | undefined
}

export interface PropertyComputeBlockOptionsTypes extends BasicBlockOptionsTypes {
    key?: string | null | undefined
}

export type MethodsTypes = (MethodGroup | MethodTypes)[]

export interface MethodGroup {
    label?: string | null | undefined
    blockOptions?: MethodBlockOptionsTypes | null | undefined
    contents: MethodsTypes
}

export interface MethodTypes {
    key: string
    label: string
    block: MethodBlockTypes
    returns?: Type | null | undefined
    throws?: Type | null | undefined
    tooltip?: string | null | undefined
    blockOptions?: MethodBlockOptionsTypes | null | undefined
}

export type MethodBlockTypes = (string | MethodBlockParam | MethodParamTypes)[]

export enum MethodBlockParam {
    THIS = "$this", METHOD = "$method"
}

export interface MethodParamTypes {
    key: string
    label: string
    type: Type
}

export interface MethodBlockOptionsTypes extends BasicBlockOptionsTypes {}

export interface EventTypes {
    key: string
    subTypes?: EventSubType[] | null | undefined
    label: string
    params: EventParamTypes[]
}

export interface EventSubType extends DropdownTypes {
    key: string
}

export interface EventParamTypes {
    key: string
    label: string
    type: Type
}

export interface DropdownTypes {
    dropdown: DropdownItemTypes[]
}

export interface DropdownItemTypes {
    label: string
    value: string
}

export interface BasicBlockOptionsTypes {
    icon?: string | null | undefined
    color?: Color | string | null | undefined
    inline?: boolean | null | undefined
    deprecated?: boolean | string | null | undefined
}

export enum Color {
    GREY = "#BABABA", RED = "#DB6656", BROWN = "#D67B18", YELLOW = "#C7C100",
    CYAN = "#00ACE8", GREEN = "#6AC44C", BLUE = "#588AF6", PURPLE = "#9D80E7",
    PINKISH_PURPLE = "#C571D8", PINK = "#D16CB0"
}

export const BUILD_IN_PROPERTIES: string[] = ["__width", "__height", "__opacity", "__position", "__visible"]

export const BUILD_IN_ICON_URL_MAP: Record<string, string> = {
    "icon-dialog": "https://creation.bcmcdn.com/716/appcraft/IMAGE_SXY4eTgli_1738894324586.svg",
    "icon-scan-qr-code": "https://creation.bcmcdn.com/716/appcraft/IMAGE_EImzw5odGZ_1738894324587.svg",
    "icon-widget-actor": "https://creation.bcmcdn.com/716/appcraft/IMAGE_YVXz1URINQ_1738894324588.svg",
    "icon-widget-audio": "https://creation.bcmcdn.com/716/appcraft/IMAGE_LPAJGpF1X__1738894324589.svg",
    "icon-widget-brush": "https://creation.bcmcdn.com/716/appcraft/IMAGE_iqAvN4M-3L_1738894324591.svg",
    "icon-widget-button": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ygdSsuBTM1_1738894324591.svg",
    "icon-widget-camera": "https://creation.bcmcdn.com/716/appcraft/IMAGE_vBhQu3HklT_1738894324592.svg",
    "icon-widget-canvas": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HyX2I21HIe_1738894324594.svg",
    "icon-widget-checkbox": "https://creation.bcmcdn.com/716/appcraft/IMAGE_L23GJxU5uG_1738894324595.svg",
    "icon-widget-cloud-dict": "https://creation.bcmcdn.com/716/appcraft/IMAGE_BTRdhvrb2l_1738894324598.svg",
    "icon-widget-cloud-room": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ZcerLC7GOC_1738894324596.svg",
    "icon-widget-cloud-table": "https://creation.bcmcdn.com/716/appcraft/IMAGE_U1NBmrg2QF_1738894324597.svg",
    "icon-widget-contact-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_eh7WY4vim9_1738894324599.svg",
    "icon-widget-date-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_5BNwaBk_IW_1738894324600.svg",
    "icon-widget-gyroscope": "https://creation.bcmcdn.com/716/appcraft/IMAGE_3a09PLSPRQ_1738894324601.svg",
    "icon-widget-http-client": "https://creation.bcmcdn.com/716/appcraft/IMAGE_yf_9_ekNHu_1738894324602.svg",
    "icon-widget-image": "https://creation.bcmcdn.com/716/appcraft/IMAGE_4sZuSDFkqIl_1738894324603.svg",
    "icon-widget-input": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-EIWoX7ctRl_1738894324604.svg",
    "icon-widget-list-viewer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_CizHBYub3vx_1738894324605.svg",
    "icon-widget-local-storage": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Nfe5M_-XqCq_1738894324606.svg",
    "icon-widget-pedometer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Uch6b-t83Fb_1738894324607.svg",
    "icon-widget-phone-dialer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_opGSFk3ryK6_1738894324608.svg",
    "icon-widget-qrcode": "https://creation.bcmcdn.com/716/appcraft/IMAGE_SKZ06Rea3il_1738894324609.svg",
    "icon-widget-radio": "https://creation.bcmcdn.com/716/appcraft/IMAGE_XsGEG6vcofk_1738894324611.svg",
    "icon-widget-slider copy 10": "https://creation.bcmcdn.com/716/appcraft/IMAGE_fSfhBEcYJIe_1738894324612.svg",
    "icon-widget-slider": "https://creation.bcmcdn.com/716/appcraft/IMAGE_EBUvZe43pi__1738894324613.svg",
    "icon-widget-sms-service": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-X_DA7es5AM_1738894324614.svg",
    "icon-widget-switch": "https://creation.bcmcdn.com/716/appcraft/IMAGE_aSqQWV61Wod_1738894324615.svg",
    "icon-widget-table-data": "https://creation.bcmcdn.com/716/appcraft/IMAGE_cQVMUNMWXJT_1738894324616.svg",
    "icon-widget-text": "https://creation.bcmcdn.com/716/appcraft/IMAGE_28OpuQ0Vq5i_1738894324617.svg",
    "icon-widget-time-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ISJT89rx6kI_1738894324618.svg",
    "icon-widget-timer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_gh8hy5hUCnq_1738894324619.svg",
    "icon-widget-volume-sensor": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HKqL2kStbYN_1738894324620.svg",
    "icon-widget-web-view": "https://creation.bcmcdn.com/716/appcraft/IMAGE_QR6adggz8xb_1738894324621.svg"
}
