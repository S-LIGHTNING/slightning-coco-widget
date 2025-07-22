import { Type } from "./type"

export interface Types extends BasicTypes {
    properties: PropertiesTypes
    methods: MethodsTypes
    events: EventTypes[]
}

export interface StandardTypes extends BasicTypes {
    properties: StandardPropertiesTypes
    methods: StandardMethodsTypes
    events: []
}

interface BasicTypes {
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

export type StandardPropertiesTypes = StandardPropertiesItem[]

export type StandardPropertiesItem = StandardPropertyGroup | StandardPropertyTypes

export interface PropertyGroup extends BasicPropertyGroup<PropertiesTypes> {}

export interface StandardPropertyGroup extends BasicPropertyGroup<StandardPropertiesTypes> {}

interface BasicPropertyGroup<CONTENTS_TYPE> {
    /**
     * 属性组标签，设置后生成的一组积木上方会显示该标签。
     */
    label?: string | null | undefined
    /**
     * 属性组积木选项。组内属性的积木选项会继承该选项。
     */
    blockOptions?: PropertyBlockOptions | null | undefined
    /**
     * 属性组内容。
     */
    contents: CONTENTS_TYPE
}

export type PropertyTypes = BriefPropertyTypes | StandardPropertyTypes

export type BriefPropertyTypes = [
    /**
     * 属性的键名，与控件实体中的属性名对应。
     */
    string,
    /**
     * 属性的标签，作为在编辑器中显示的属性名。
     */
    string,
    /**
     * 属性的类型或默认值。
     */
    BriefType,
    /**
     * 属性的积木选项。
     */
    (PropertyOptions | null | undefined)?
]

export interface StandardPropertyTypes extends PropertyOptions {
    /**
     * 属性的键名，与控件实体中的属性名对应。
     */
    key: string
    /**
     * 属性的标签，作为在编辑器中显示的属性名。
     */
    label: string
    /**
     * 属性的类型。
     */
    type: Type
}

/**
 * @deprecated 请使用 `PropertyBlockOptions` 代替。
 */
export type PropertyBlockOptionsTypes = PropertyBlockOptions

export interface PropertyOptions {
    /**
     * 属性的积木选项。
     */
    blockOptions?: PropertyBlockOptions | null | undefined
}

export interface PropertyBlockOptions {
    /**
     * 取值方法积木选项。
     *
     * 设为 `false` 则不生成取值方法积木。
     */
    get?: boolean | PropertyComputeBlockOptions | null | undefined
    /**
     * 赋值方法积木选项。
     *
     * 设为 `false` 则不生成赋值方法积木。
     */
    set?: boolean | PropertyComputeBlockOptions | null | undefined
}

/**
 * @deprecated 请使用 `PropertyComputeBlockOptions` 代替。
 */
export type PropertyComputeBlockOptionsTypes = PropertyComputeBlockOptions

export interface PropertyComputeBlockOptions extends BasicBlockOptions {
    /**
     * 计算方法（取值/赋值方法）的键名，与控件实体中的方法名对应。
     *
     * 默认为 `get${capitalize(key)}` 或 `set${capitalize(key)}`，其中 `capitalize(key)` 为大写首字母的属性键名。
     *
     * 如果控件实体中不存在该方法，会自动生成。
     */
    key?: string | null | undefined
}

export type MethodsTypes = (MethodGroup | MethodTypes | ClearEventTypes | BlockBoxOptions)[]

export type StandardMethodsTypes = StandardMethodsItem[]

export type StandardMethodsItem = StandardMethodGroup | StandardMethodTypes | StandardEventTypes | BlockBoxOptions

export interface MethodGroup extends BasicMethodGroup<MethodsTypes> {}

export interface StandardMethodGroup extends BasicMethodGroup<StandardMethodsTypes> {}

interface BasicMethodGroup<CONTENTS_TYPE> {
    /**
     * 方法组标签，设置后生成的一组积木上方会显示该标签。
     */
    label?: string | null | undefined
    /**
     * 方法组积木选项。组内方法的积木选项会继承该选项。
     */
    blockOptions?: MethodBlockOptions | null | undefined
    /**
     * 方法组内容。
     */
    contents: CONTENTS_TYPE
}

export type MethodTypes = BriefMethodTypes | UnclearBriefMethodTypes | PartiallyStandardMethodTypes | UnclearPartiallyStandardMethodTypes

export type BriefMethodTypes = [
    typeof BlockType.METHOD,
    /**
     * 方法的键名，与控件实体中的方法名对应。
     */
    string,
    /**
     * 方法的标签。
     */
    string,
    /**
     * 方法的积木。
     *
     * 同 `StandardMethodTypes` 中的 `block`。
     */
    MethodBlock,
    /**
     * 方法的返回值类型。
     *
     * 同 `StandardMethodTypes` 中的 `returns`。
     */
    (Type | null | undefined)?,
    /**
     * 方法的其他配置。
     */
    (MethodOptions | null | undefined)?
]

export type UnclearBriefMethodTypes = [
    /**
     * 方法的键名，与控件实体中的方法名对应。
     */
    string,
    /**
     * 方法的标签。
     */
    string,
    /**
     * 方法的积木。
     *
     * 同 `StandardMethodTypes` 中的 `block`。
     */
    MethodBlock,
    /**
     * 方法的返回值类型。
     *
     * 同 `StandardMethodTypes` 中的 `returns`。
     */
    (Type | null | undefined)?,
    /**
     * 方法的其他配置。
     */
    (MethodOptions | null | undefined)?
]

export interface PartiallyStandardMethodTypes extends BasicStandardMethodTypes<MethodBlock> {
    type: typeof BlockType.METHOD
}

export interface UnclearPartiallyStandardMethodTypes extends BasicStandardMethodTypes<MethodBlock> {
    type?: typeof BlockType.METHOD | null | undefined
}

export interface StandardMethodTypes extends BasicStandardMethodTypes<StandardMethodBlock> {
    type: typeof BlockType.METHOD
}

export interface UnclearStandardMethodTypes extends BasicStandardMethodTypes<StandardMethodBlock> {
    type?: typeof BlockType.METHOD | null | undefined
}

interface BasicStandardMethodTypes<BLOCK_TYPE> extends MethodOptions {
    /**
     * 方法的键名，与控件实体中的方法名对应。
     */
    key: string
    /**
     * 方法的标签。
     */
    label: string
    /**
     * 方法的积木。
     *
     * 可以是以下内容：
     *
     * - `MethodBlockParam.THIS`：`this` 参数，即控件实例本身，`this` 参数必须是第一个参数。
     * - `MethodBlockParam.METHOD`：方法标签文本。
     * - `MethodBlockParam.BREAK_LINE`：换行标识。对于多行显示的积木，如果存在换行标识且换行方式可以实现，会按照该换行标识换行，否则一个参数一行。
     * - 字符串：说明文本。
     * - MethodParamTypes：方法参数。
     */
    block: BLOCK_TYPE
    /**
     * 方法的返回值类型。
     *
     * 不设置或设置为空时，表示没有返回值。
     */
    returns?: Type | null | undefined
}

/**
 * @deprecated 请使用 `MethodBlock` 代替。
 */
export type MethodBlockTypes = MethodBlock

export type MethodBlock = MethodBlockItem[]

export type MethodBlockItem = string | MethodBlockParam | MethodParamTypes

export type StandardMethodBlock = StandardMethodBlockItem[]

export type StandardMethodBlockItem = string | MethodBlockParam | StandardMethodParamTypes

export enum MethodBlockParam {
    THIS = "$this",
    METHOD = "$method",
    BREAK_LINE = "$break_line"
}

export type MethodParamTypes = BriefMethodParamTypes | StandardMethodParamTypes

export type BriefMethodParamTypes = [
    /**
     * 参数的键名。
     */
    string,
    /**
     * 参数的标签。
     */
    string,
    /**
     * 参数的类型或默认值。
     */
    BriefType
]

export interface StandardMethodParamTypes {
    /**
     * 参数的键名。
     */
    key: string
    /**
     * 参数的标签。
     */
    label: string
    /**
     * 参数的类型。
     */
    type: Type
}

export interface MethodOptions {
    /**
     * 方法的抛出异常类型。
     *
     * 不设置或设置为空时，表示不会抛出异常。
     */
    throws?: Type | null | undefined
    /**
     * 方法提示信息，当鼠标悬停在积木上时显示。
     */
    tooltip?: string | null | undefined
    /**
     * 是否已被弃用。
     *
     * 已弃用的方法具有以下特点：
     *
     * - 积木前会显示 `[已弃用]` 标签；
     * - 积木显示为灰色（覆盖 `color` 选项）；
     * - tooltip 中会提示弃用；
     * - 调用时会显示警告。
     *
     * 设为 `true` 表示方法已弃用。
     *
     * 设为 `string` 表示弃用说明，默认弃用说明为“该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法”。
     */
    deprecated?: boolean | string | null | undefined
    /**
     * 方法的积木选项。
     */
    blockOptions?: MethodBlockOptions | null | undefined
}

/**
 * @deprecated 请使用 `MethodBlockOptions` 代替。
 */
export type MethodBlockOptionsTypes = MethodBlockOptions

export interface MethodBlockOptions extends BasicBlockOptions {}

export interface BlockBoxOptions {
    /**
     * 积木间距。
     */
    space?: number
    /**
     * 在积木上方显示的提示。
     */
    line?: string
}

export type EventTypes = BriefEventTypes | UnclearBriefEventTypes | PartiallyStandardEventTypes | UnclearPartiallyStandardEventTypes

export type ClearEventTypes = BriefEventTypes | PartiallyStandardEventTypes

export type BriefEventTypes = [
    typeof BlockType.EVENT,
    /**
     * 事件的键名，触发事件时需要传入的键名。
     */
    string,
    /**
     * 事件的标签，作为在编辑器中显示的名称。
     */
    string,
    /**
     * 事件的参数。触发事件时需要传入的参数，顺序与此处定义的顺序一致。
     */
    EventParamTypes[],
    (EventOptions | null | undefined)?
] | [
    typeof BlockType.EVENT,
    /**
     * 事件的键名，触发事件时需要传入的键名。
     */
    string,
    /**
     * 事件的标签，作为在编辑器中显示的名称。
     */
    string,
    /**
     * 事件的子类型。
     *
     * 类似于 `StandardEventTypes` 中的 `subTypes` 属性。
     */
    EventSubType[],
    /**
     * 事件的参数。触发事件时需要传入的参数，顺序与此处定义的顺序一致。
     */
    EventParamTypes[],
    (EventOptions | null | undefined)?
]

export type UnclearBriefEventTypes = [
    /**
     * 事件的键名，触发事件时需要传入的键名。
     */
    string,
    /**
     * 事件的标签，作为在编辑器中显示的名称。
     */
    string,
    /**
     * 事件的参数。触发事件时需要传入的参数，顺序与此处定义的顺序一致。
     */
    EventParamTypes[],
    (EventOptions | null | undefined)?
] | [
    /**
     * 事件的键名，触发事件时需要传入的键名。
     */
    string,
    /**
     * 事件的标签，作为在编辑器中显示的名称。
     */
    string,
    /**
     * 事件的子类型。
     *
     * 类似于 `StandardEventTypes` 中的 `subTypes` 属性。
     */
    EventSubType[],
    /**
     * 事件的参数。触发事件时需要传入的参数，顺序与此处定义的顺序一致。
     */
    EventParamTypes[],
    (EventOptions | null | undefined)?
]

export interface PartiallyStandardEventTypes extends BasicStandardEventTypes<EventSubType, EventParamTypes> {
    type: typeof BlockType.EVENT
}
export interface UnclearPartiallyStandardEventTypes extends BasicStandardEventTypes<EventSubType, EventParamTypes> {
    type?: typeof BlockType.EVENT | null | undefined
}

export interface StandardEventTypes extends BasicStandardEventTypes<StandardEventSubType, StandardEventParamTypes> {
    type: typeof BlockType.EVENT
}

export interface UnclearStandardEventTypes extends BasicStandardEventTypes<StandardEventSubType, StandardEventParamTypes> {
    type?: typeof BlockType.EVENT | null | undefined
}

interface BasicStandardEventTypes<SUB_TYPE, PARAMS_TYPE> extends EventOptions {
    /**
     * 事件的键名，触发事件时需要传入的键名。
     */
    key: string
    /**
     * 事件的标签，作为在编辑器中显示的名称。
     */
    label: string
    /**
     * 事件的子类型。
     *
     * **仅在 CoCo 中生效，Creation Project 不支持该特性。**
     *
     * 注：如果要在 Creation Project 中使用该特性，请使用 `flattenEventSubTypes` 装饰器将子类型展开。
     */
    subTypes?: SUB_TYPE[] | null | undefined
    /**
     * 事件的参数。触发事件时需要传入的参数，顺序与此处定义的顺序一致。
     */
    params: PARAMS_TYPE[]
}

export interface EventOptions {
    /**
     * 事件的提示信息，当鼠标悬停在积木上时显示。
     *
     * **仅在 CoCo 中生效，Creation Project 不支持该特性。**
     */
    tooltip?: string | null | undefined
    /**
     * 是否已被弃用。
     *
     * 已弃用的事件具有以下特点：
     *
     * - 积木前会显示 `[已弃用]` 标签；
     * - 积木显示为灰色（如果可以做到的话）（覆盖 `color` 选项）；
     * - tooltip 中会提示弃用；
     * - 使用事件时会显示警告（如果可以做到的话）。
     *
     * 设为 `true` 表示事件已弃用。
     *
     * 设为 `string` 表示弃用说明，默认弃用说明为“该事件已弃用，并且可能在未来版本中移除，请尽快迁移到其他事件”。
     */
    deprecated?: boolean | string | null | undefined
    /**
     * 事件的积木选项。
     *
     * **仅在 CoCo 中生效，Creation Project 不支持该特性。**
     */
    blockOptions?: EventBlockOptions | null | undefined
}

export type EventSubType = BriefEventSubType | PartiallyStandardEventSubType

export type BriefEventSubType = [
    /**
     * 子类型的键名。
     */
    string,
    /**
     * 下拉选项。
     */
    DropdownItem[]
]

export interface PartiallyStandardEventSubType extends Dropdown {
    /**
     * 子类型的键名。
     */
    key: string
}

export interface StandardEventSubType extends StandardDropdown {
    /**
     * 子类型的键名。
     */
    key: string
}

export type EventParamTypes = BriefEventParamTypes | StandardEventParamTypes

export type BriefEventParamTypes = [
    /**
     * 事件参数的键名。
     */
    string,
    /**
     * 事件参数的标签，作为在编辑器中显示的名称。
     */
    string,
    /**
     * 事件参数的类型。
     */
    Type
]

export interface StandardEventParamTypes {
    /**
     * 事件参数的键名。
     */
    key: string
    /**
     * 事件参数的标签，作为在编辑器中显示的名称。
     */
    label: string
    /**
     * 事件参数的类型。
     */
    type: Type
}

/**
 * @deprecated 请使用 `EventBlockOptions` 代替。
 */
export type EventBlockOptionsTypes = EventBlockOptions

export interface EventBlockOptions extends BasicBlockOptions {}

/**
 * @deprecated 请使用 `Dropdown` 代替。
 */
export type DropdownTypes = Dropdown

export interface Dropdown {
    /**
     * 下拉选项。
     */
    dropdown: DropdownItem[]
}

export type DropdownItem = BriefDropdownItem | StandardDropdownItem

export interface BriefDropdown {
    /**
     * 下拉选项。
     */
    dropdown: BriefDropdownItem[]
}

export type BriefDropdownItem = [
    /**
     * 选项的标签，作为在编辑器中显示的名称。
     */
    string,
    /**
     * 选项的值。
     */
    string
]

export interface StandardDropdown {
    /**
     * 下拉选项。
     */
    dropdown: StandardDropdownItem[]
}

export interface StandardDropdownItem {
    /**
     * 选项的标签，作为在编辑器中显示的名称。
     */
    label: string
    /**
     * 选项的值。
     */
    value: string
}

export class BlockType<T> {

    public static readonly METHOD: BlockType<"METHOD"> = new BlockType("METHOD", "方法")
    public static readonly EVENT: BlockType<"EVENT"> = new BlockType("EVENT", "事件")

    public readonly symbol: symbol

    private constructor(
        public readonly key: T,
        public readonly name: string
    ) {
        this.symbol = Symbol(name)
    }

    public toString(): string {
        return `积木类型(${this.name})`
    }
}

export interface BasicBlockOptions {
    /**
     * 积木图标链接。设置后会在积木前显示图标。
     *
     * **仅在 CoCo 中生效，Creation Project 不支持该特性。**
     */
    icon?: string | null | undefined
    /**
     * 积木的颜色。
     */
    color?: Color | string | null | undefined
    /**
     * 是否在一行显示。
     *
     * 如果设为 `false`，则生成的积木会显示为多行，第一行显示方法标签和 `this` 参数，后面几行显示其他参数。
     */
    inline?: boolean | null | undefined
    /**
     * @deprecated 请使用方法或事件的 `deprecated` 选项代替。
     *
     * 是否已被弃用。
     *
     * 已弃用的方法或事件具有以下特点：
     *
     * - 积木前会显示 `[已弃用]` 标签；
     * - 积木显示为灰色（如果可以做到的话）（覆盖 `color` 选项）；
     * - tooltip 中会提示弃用；
     * - 方法调用时会显示警告。
     *
     * 设为 `true` 表示方法已弃用。
     *
     * 设为 `string` 表示弃用说明，默认弃用说明为“该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法”。
     */
    deprecated?: boolean | string | null | undefined
}
/**
 * 简洁类型或其默认值。
 *
 * - 当类型为 `Type` 时，表示属性的类型；
 * - 当类型为 `string`、`number`、`boolean`、`DropdownItem[]` 时，表示属性的默认值，属性的类型按照如下规则自动推断：
 *   - `string`：类型为 `StringType`；
 *   - `number`：类型为 `NumberType`；
 *   - `boolean`：类型为 `BooleanType`；
 *   - `DropdownItem[]`：类型为 `StringEnumType`。
 */
export type BriefType = string | number | boolean | DropdownItem[] | Type

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
