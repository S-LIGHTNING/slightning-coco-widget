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
