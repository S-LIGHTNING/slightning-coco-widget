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
        /**
         * 控件作者。
         *
         * **仅在耶椰椰中生效，CoCo 和 Creation Project 不支持该属性。**
         */
        author?: string | null | undefined
        url?: {
            /**
             * 控件主页链接。
             */
            homepage?: string | null | undefined
            /**
             * 控件文档链接。
             *
             * 设置后可在控件属性面板下方点击“如何使用？”跳转到文档。
             *
             * **仅在 CoCo 中生效，Creation Project 不支持该特性。**
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

export interface MethodBlockOptions extends BasicBlockOptions {
    /**
     * 规定积木是否能与上一块积木拼接，仅在方法无返回值时生效。
     *
     * **仅在 Creation Project 中生效，CoCo 不支持该特性。**
     */
    previousStatement?: boolean | null | undefined
    /**
     * 规定积木是否能与下一块积木拼接，仅在方法无返回值时生效。
     *
     * **仅在 Creation Project 中生效，CoCo 不支持该特性。**
     */
    nextStatement?: boolean | null | undefined
}

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

    COCO_EVENT = "#608FEE",
    COCO_CONTROL = "#68CDFF",
    COCO_FUNCTION0 = "#00AFC3",
    COCO_OPERATION = "#FEAE8A",
    COCO_VARIABLE = "#FFBB55",
    COCO_LIST = "#F9CC37",
    COCO_DICTIONARY = "#A073FF",
    COCO_FUNCTION1 = "#F88767",

    CREATION_PROJECT_EVENT = "#608FEE",
    CREATION_PROJECT_CONTROL = "#68CDFF",
    CREATION_PROJECT_CALCULATION = "#FEAE8A",
    CREATION_PROJECT_FUNCTION0 = "#00AFC3",
    CREATION_PROJECT_OBJECT = "#A073FF",
    CREATION_PROJECT_LIST = "#F9CC37",
    CREATION_PROJECT_VARIABLE = "#FFBB55",
    CREATION_PROJECT_FUNCTION1 = "#F88767",

    GREY = "#BABABA",
    RED = "#DB6656",
    BROWN = "#D67B18",
    ORANGE = "#D3A813",
    YELLOW = "#C7C100",
    YELLOWISH_GREEN = "#A2C028",
    GREEN = "#6AC44C",
    TURQUOISE = "#1BB897",
    CYAN = "#00ACE8",
    BLUE = "#588AF6",
    BLUISH_VIOLET = "#7D8DF9",
    PURPLE = "#9D80E7",
    PINKISH_PURPLE = "#C571D8",
    PINK = "#D16CB0"
}

export const BUILD_IN_PROPERTIES: string[] = ["__width", "__height", "__opacity", "__position", "__visible"]

export const BUILD_IN_ICON_URL_MAP: Record<string, string> = {
    "icon-Icon": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HhHDoXc2TN2_1753342119444.svg",
    "icon-Image": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ZeF78UjjblO_1753342119456.svg",
    "icon-add": "https://creation.bcmcdn.com/716/appcraft/IMAGE_S0AnOiIGJ_1753342119240.svg",
    "icon-add-customize": "https://creation.bcmcdn.com/716/appcraft/IMAGE_jyahJHmf0V_1753342119245.svg",
    "icon-add2": "https://creation.bcmcdn.com/716/appcraft/IMAGE_mX_S_t9oMr_1753342119242.svg",
    "icon-added-customize": "https://creation.bcmcdn.com/716/appcraft/IMAGE_3FRhSOdmku_1753342119249.svg",
    "icon-alert-error": "https://creation.bcmcdn.com/716/appcraft/IMAGE_1T1SjbDXqg_1753342119247.svg",
    "icon-alert-info": "https://creation.bcmcdn.com/716/appcraft/IMAGE_8IhtsfglPs_1753342119251.svg",
    "icon-alert-success": "https://creation.bcmcdn.com/716/appcraft/IMAGE_eYKvcbtzXO_1753342119283.svg",
    "icon-align-center": "https://creation.bcmcdn.com/716/appcraft/IMAGE_f7JzsoKZnc_1753342119286.svg",
    "icon-align-left": "https://creation.bcmcdn.com/716/appcraft/IMAGE_SkCKP8_98r_1753342119288.svg",
    "icon-align-right": "https://creation.bcmcdn.com/716/appcraft/IMAGE_FiO2JBhq5V_1753342119289.svg",
    "icon-android": "https://creation.bcmcdn.com/716/appcraft/IMAGE_2N4ey0PZCw_1753342119291.svg",
    "icon-android-fill": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Czmt7PMVgo_1753342119293.svg",
    "icon-apk": "https://creation.bcmcdn.com/716/appcraft/IMAGE_BO99OiXjOM_1753342119295.svg",
    "icon-arrow-down": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HKJacZIH4U_1753342119299.svg",
    "icon-attribute": "https://creation.bcmcdn.com/716/appcraft/IMAGE__eRiyz-VBW_1753342119302.svg",
    "icon-block-drag-delete": "https://creation.bcmcdn.com/716/appcraft/IMAGE_DNNByc40Gl_1753342119304.svg",
    "icon-box": "https://creation.bcmcdn.com/716/appcraft/IMAGE_BBC6U_6Yy0j_1753342119308.svg",
    "icon-brush-arrow": "https://creation.bcmcdn.com/716/appcraft/IMAGE_woo7e9lHfG8_1753342119306.svg",
    "icon-btn-fallback": "https://creation.bcmcdn.com/716/appcraft/IMAGE_u4C94MjElT0_1753342119309.svg",
    "icon-btn-overview": "https://creation.bcmcdn.com/716/appcraft/IMAGE_BGYxviKadSj_1753342119310.svg",
    "icon-change-icon": "https://creation.bcmcdn.com/716/appcraft/IMAGE_C9-MlJRyft9_1753342119312.svg",
    "icon-chrome": "https://creation.bcmcdn.com/716/appcraft/IMAGE_1CZGYLKqoCa_1753342119317.svg",
    "icon-clean-up": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ioqWY5cN-Cb_1753342119319.svg",
    "icon-clear": "https://creation.bcmcdn.com/716/appcraft/IMAGE_fjwCesLZB9E_1753342119322.svg",
    "icon-close": "https://creation.bcmcdn.com/716/appcraft/IMAGE_H4zIxre6Ct7_1753342119324.svg",
    "icon-close-bold": "https://creation.bcmcdn.com/716/appcraft/IMAGE_QK_E39B-wgy_1753342119326.svg",
    "icon-close-btn": "https://creation.bcmcdn.com/716/appcraft/IMAGE_xEVGzh1T7QM_1753342119328.svg",
    "icon-close-datawatch": "https://creation.bcmcdn.com/716/appcraft/IMAGE_a_NA0Lzk79j_1753342119329.svg",
    "icon-cloud-manager-error": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Kdt9TqEW49I_1753342119334.svg",
    "icon-cloud-manager-normal": "https://creation.bcmcdn.com/716/appcraft/IMAGE_dqcEt1hSPJF_1753342119336.svg",
    "icon-cloud-manager-warn": "https://creation.bcmcdn.com/716/appcraft/IMAGE_BXzAchXHyOl_1753342119338.svg",
    "icon-collaborate": "https://creation.bcmcdn.com/716/appcraft/IMAGE_2bml6qr7Dfj_1753342119339.svg",
    "icon-collaborate-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_pRPXql2wgZo_1753342119341.svg",
    "icon-collaborator": "https://creation.bcmcdn.com/716/appcraft/IMAGE_2UIxWi2-WyQ_1753342119342.svg",
    "icon-console": "https://creation.bcmcdn.com/716/appcraft/IMAGE_rcD9HxXU-94_1753342119344.svg",
    "icon-console-error": "https://creation.bcmcdn.com/716/appcraft/IMAGE_M1T9ju7bWo0_1753342119348.svg",
    "icon-contain": "https://creation.bcmcdn.com/716/appcraft/IMAGE_hZYlm6W3hgp_1753342119350.svg",
    "icon-contain-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_wpNr1t2ixEW_1753342119351.svg",
    "icon-copy": "https://creation.bcmcdn.com/716/appcraft/IMAGE_TWzcw65nVos_1753342119353.svg",
    "icon-copy-slight": "https://creation.bcmcdn.com/716/appcraft/IMAGE_WMhSpEMAcCJ_1753342119355.svg",
    "icon-corner-right-top": "https://creation.bcmcdn.com/716/appcraft/IMAGE_0znCDqeIxlr_1753342119356.svg",
    "icon-cover": "https://creation.bcmcdn.com/716/appcraft/IMAGE_iU_W8sZq1cV_1753342119358.svg",
    "icon-cover-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_yXUf1GaS1dm_1753342119359.svg",
    "icon-data": "https://creation.bcmcdn.com/716/appcraft/IMAGE_kp0yVxktWQ5_1753342119361.svg",
    "icon-data-watch-pin": "https://creation.bcmcdn.com/716/appcraft/IMAGE_kP7FxDcfBOS_1753342119369.svg",
    "icon-data-watch-unpin": "https://creation.bcmcdn.com/716/appcraft/IMAGE_uYlEoGMl2dv_1753342119372.svg",
    "icon-database-manage": "https://creation.bcmcdn.com/716/appcraft/IMAGE_WwTN9HrcndN_1753342119365.svg",
    "icon-database-manage-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_EwUtKTN9A4d_1753342119367.svg",
    "icon-delete": "https://creation.bcmcdn.com/716/appcraft/IMAGE_LG9jOFcdrMI_1753342119374.svg",
    "icon-delete-bold": "https://creation.bcmcdn.com/716/appcraft/IMAGE_M8raeViVbjN_1753342119376.svg",
    "icon-delete-bottom": "https://creation.bcmcdn.com/716/appcraft/IMAGE_omU3ts0ymvR_1753342119378.svg",
    "icon-delete-top": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ZsWSdrzMi8n_1753342119384.svg",
    "icon-dialog": "https://creation.bcmcdn.com/716/appcraft/IMAGE_6F00N79GMtp_1753342119387.svg",
    "icon-double-arrow": "https://creation.bcmcdn.com/716/appcraft/IMAGE_xvARzprr_Bw_1753342119389.svg",
    "icon-down": "https://creation.bcmcdn.com/716/appcraft/IMAGE_7_0rYX9qb_j_1753342119391.svg",
    "icon-download-apk": "https://creation.bcmcdn.com/716/appcraft/IMAGE_uqmhTSeMyVL_1753342119393.svg",
    "icon-download-fonts": "https://creation.bcmcdn.com/716/appcraft/IMAGE_0H5yL0V8UfQ_1753342119394.svg",
    "icon-drag-bar": "https://creation.bcmcdn.com/716/appcraft/IMAGE_7O-LF1aQ6h1_1753342119397.svg",
    "icon-dropdown-down": "https://creation.bcmcdn.com/716/appcraft/IMAGE_1UV0ugFNtRU_1753342119401.svg",
    "icon-edit": "https://creation.bcmcdn.com/716/appcraft/IMAGE_JAGFB_zDbnd_1753342119403.svg",
    "icon-edit-round": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HAETxLs7USY_1753342119404.svg",
    "icon-error": "https://creation.bcmcdn.com/716/appcraft/IMAGE_znKmh3cofm-_1753342119406.svg",
    "icon-file": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Mkf0IGyuVsj_1753342119408.svg",
    "icon-filter": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Orjp6OgFd6C_1753342119410.svg",
    "icon-fold": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Vu_bQlwK4pD_1753342119412.svg",
    "icon-fold-datawatch": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ToNSCNc-ayu_1753342119415.svg",
    "icon-fold-left": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ekTzWD56ZwY_1753342119417.svg",
    "icon-grid-boolean": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-wT8u_A0K9l_1753342119420.svg",
    "icon-grid-number": "https://creation.bcmcdn.com/716/appcraft/IMAGE_GCB0qCWJ63C_1753342119422.svg",
    "icon-grid-string": "https://creation.bcmcdn.com/716/appcraft/IMAGE__ybjwKP2km7_1753342119423.svg",
    "icon-group": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Mb9sFKvZsMG_1753342119425.svg",
    "icon-help": "https://creation.bcmcdn.com/716/appcraft/IMAGE_fnyTP4ALfHo_1753342119427.svg",
    "icon-help-circle": "https://creation.bcmcdn.com/716/appcraft/IMAGE_6HUZcqXFOGQ_1753342119428.svg",
    "icon-help-circle-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE__BXbmrqSYXZ_1753342119435.svg",
    "icon-hidden": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Sati2LinOjS_1753342119437.svg",
    "icon-hide": "https://creation.bcmcdn.com/716/appcraft/IMAGE_v3d4zCpZZ8W_1753342119439.svg",
    "icon-horizontal": "https://creation.bcmcdn.com/716/appcraft/IMAGE_yfWYXe1Dpqn_1753342119441.svg",
    "icon-horizontal-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_5P_w0smElLt_1753342119443.svg",
    "icon-image-library": "https://creation.bcmcdn.com/716/appcraft/IMAGE_vjjYZVsdOfU_1753342119478.svg",
    "icon-image-library-primary": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ROVq5NsAdUJ_1753342119457.svg",
    "icon-image-upload": "https://creation.bcmcdn.com/716/appcraft/IMAGE_RpCBW8IoDr-_1753342119459.svg",
    "icon-list": "https://creation.bcmcdn.com/716/appcraft/IMAGE_sSyGbBk8nlk_1753342119474.svg",
    "icon-loading": "https://creation.bcmcdn.com/716/appcraft/IMAGE_jnZ3bovNVj9_1753342119461.svg",
    "icon-loading2": "https://creation.bcmcdn.com/716/appcraft/IMAGE_jZx_bAZLzZP_1753342119493.svg",
    "icon-location": "https://creation.bcmcdn.com/716/appcraft/IMAGE_J5p7Qlx8yhp_1753342119485.svg",
    "icon-locked": "https://creation.bcmcdn.com/716/appcraft/IMAGE_IrT9TXo3DHA_1753342119487.svg",
    "icon-material-gif": "https://creation.bcmcdn.com/716/appcraft/IMAGE_bLbqF9hyRIE_1753342119491.svg",
    "icon-material-search": "https://creation.bcmcdn.com/716/appcraft/IMAGE_MP1ch6v1G_B_1753342119495.svg",
    "icon-material-store": "https://creation.bcmcdn.com/716/appcraft/IMAGE_1zd48195jlE_1753342119499.svg",
    "icon-minus": "https://creation.bcmcdn.com/716/appcraft/IMAGE_qiayCqeTH_B_1753342119502.svg",
    "icon-more": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-oKGUWIHPPK_1753342119503.svg",
    "icon-music": "https://creation.bcmcdn.com/716/appcraft/IMAGE_cS7bdoU29vF_1753342119505.svg",
    "icon-my-project": "https://creation.bcmcdn.com/716/appcraft/IMAGE_OTUm3Dzb-EX_1753342119506.svg",
    "icon-net": "https://creation.bcmcdn.com/716/appcraft/IMAGE_VfOeRU1mqX9_1753342119508.svg",
    "icon-new-project": "https://creation.bcmcdn.com/716/appcraft/IMAGE_1tnqjYIsFRo_1753342119509.svg",
    "icon-next-screen": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ytwgxcD830x_1753342119511.svg",
    "icon-open": "https://creation.bcmcdn.com/716/appcraft/IMAGE_7rDcr_29LWr_1753342119515.svg",
    "icon-open-console-log": "https://creation.bcmcdn.com/716/appcraft/IMAGE_7PtR1G3dLpC_1753342119516.svg",
    "icon-open-resource-library": "https://creation.bcmcdn.com/716/appcraft/IMAGE_fkYdnk5XFn6_1753342119521.svg",
    "icon-open-widget-panel": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Etm386H90FE_1753342119524.svg",
    "icon-openview": "https://creation.bcmcdn.com/716/appcraft/IMAGE_uH-kXQsfVlw_1753342119523.svg",
    "icon-ot-invitation": "https://creation.bcmcdn.com/716/appcraft/IMAGE_559s0E_eAAb_1753342119526.svg",
    "icon-package-copy": "https://creation.bcmcdn.com/716/appcraft/IMAGE_zoel3KV7F4A_1753342119528.svg",
    "icon-package-download": "https://creation.bcmcdn.com/716/appcraft/IMAGE_E-tt4c5EOPq_1753342119530.svg",
    "icon-package-editor-big": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Zv7ThRnsCn1_1753342119533.svg",
    "icon-package-editor-small": "https://creation.bcmcdn.com/716/appcraft/IMAGE_cxVJHdcrmIX_1753342119534.svg",
    "icon-pause": "https://creation.bcmcdn.com/716/appcraft/IMAGE_AW832fMx95-_1753342119536.svg",
    "icon-phone-call-dial": "https://creation.bcmcdn.com/716/appcraft/IMAGE_cJVwGD0AI9r_1753342119538.svg",
    "icon-phone-call-disconnect": "https://creation.bcmcdn.com/716/appcraft/IMAGE_SfIe0rF-OA3_1753342119541.svg",
    "icon-phone-call-idle": "https://creation.bcmcdn.com/716/appcraft/IMAGE_uw1JBx1a6nh_1753342119543.svg",
    "icon-pic-default": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ccHICiMzkvz_1753342119546.svg",
    "icon-pick-up": "https://creation.bcmcdn.com/716/appcraft/IMAGE_oJWCXPVCENT_1753342119554.svg",
    "icon-picker-color": "https://creation.bcmcdn.com/716/appcraft/IMAGE_PLQKkPdakqJ_1753342119549.svg",
    "icon-picker-core": "https://creation.bcmcdn.com/716/appcraft/IMAGE_hQaIZNnOIiU_1753342119551.svg",
    "icon-picker-shell": "https://creation.bcmcdn.com/716/appcraft/IMAGE_d78UML4Q-6y_1753342119553.svg",
    "icon-play": "https://creation.bcmcdn.com/716/appcraft/IMAGE_hFefUFnDScC_1753342119556.svg",
    "icon-player-link": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Z4XbgimQscz_1753342119559.svg",
    "icon-player-upload-file": "https://creation.bcmcdn.com/716/appcraft/IMAGE_qnyS4TUBctf_1753342119560.svg",
    "icon-prev-screen": "https://creation.bcmcdn.com/716/appcraft/IMAGE_tcfmFAlRwgE_1753342119562.svg",
    "icon-project-resources": "https://creation.bcmcdn.com/716/appcraft/IMAGE_EBosUntvsWo_1753342119565.svg",
    "icon-public": "https://creation.bcmcdn.com/716/appcraft/IMAGE_xOhOji-_nQq_1753342119566.svg",
    "icon-publish": "https://creation.bcmcdn.com/716/appcraft/IMAGE_8Vemfk9Yuo3_1753342119568.svg",
    "icon-qr-code": "https://creation.bcmcdn.com/716/appcraft/IMAGE_VR7Gkp0krIw_1753342119569.svg",
    "icon-radio-correct": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Qon7MQONOcx_1753342119571.svg",
    "icon-radio-incorrect": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-nxXKuswbgF_1753342119573.svg",
    "icon-redo": "https://creation.bcmcdn.com/716/appcraft/IMAGE_nc0_5z9kJNW_1753342119575.svg",
    "icon-refresh-database": "https://creation.bcmcdn.com/716/appcraft/IMAGE_gDGkcas6Rrj_1753342119577.svg",
    "icon-resetData": "https://creation.bcmcdn.com/716/appcraft/IMAGE_tcjCfxPLX6q_1753342119579.svg",
    "icon-resource-library": "https://creation.bcmcdn.com/716/appcraft/IMAGE_AFriPqq7eg1_1753342119594.svg",
    "icon-return-arrow": "https://creation.bcmcdn.com/716/appcraft/IMAGE_RbLYI_KJNtA_1753342119597.svg",
    "icon-right": "https://creation.bcmcdn.com/716/appcraft/IMAGE_FrkXOVh_ar4_1753342119600.svg",
    "icon-save": "https://creation.bcmcdn.com/716/appcraft/IMAGE_PfhfNCSYUzF_1753342119601.svg",
    "icon-save-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_MiXOlQP6lq6_1753342119604.svg",
    "icon-scan-qr-code": "https://creation.bcmcdn.com/716/appcraft/IMAGE_BT5ztje9D8v_1753342119608.svg",
    "icon-screen": "https://creation.bcmcdn.com/716/appcraft/IMAGE_VXPLoXHu3nV_1753342119609.svg",
    "icon-screen-bottom": "https://creation.bcmcdn.com/716/appcraft/IMAGE_kvrNxFp1sqb_1753342119611.svg",
    "icon-screen-manage": "https://creation.bcmcdn.com/716/appcraft/IMAGE_490jFS2hgRj_1753342119617.svg",
    "icon-screen-variable": "https://creation.bcmcdn.com/716/appcraft/IMAGE__x2VTo6Ct1p_1753342119614.svg",
    "icon-screen-variable-plus": "https://creation.bcmcdn.com/716/appcraft/IMAGE_nguxUMBKSx6_1753342119619.svg",
    "icon-see": "https://creation.bcmcdn.com/716/appcraft/IMAGE_izORYpVfddr_1753342119620.svg",
    "icon-see-disable": "https://creation.bcmcdn.com/716/appcraft/IMAGE_2K8dAZJeaq-_1753342119622.svg",
    "icon-selected": "https://creation.bcmcdn.com/716/appcraft/IMAGE_utgOZJy2ZnR_1753342119624.svg",
    "icon-settings": "https://creation.bcmcdn.com/716/appcraft/IMAGE_re7TFcCaIGf_1753342119626.svg",
    "icon-share": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Q6LjAaVhMU9_1753342119628.svg",
    "icon-shop": "https://creation.bcmcdn.com/716/appcraft/IMAGE_fVcl9_S1GYR_1753342119633.svg",
    "icon-shouqi": "https://creation.bcmcdn.com/716/appcraft/IMAGE_yNQZh1X0gQO_1753342119644.svg",
    "icon-show": "https://creation.bcmcdn.com/716/appcraft/IMAGE_XgpXFr9-bsH_1753342119646.svg",
    "icon-simple-style-switch": "https://creation.bcmcdn.com/716/appcraft/IMAGE_kCYF0ea7RdA_1753342119651.svg",
    "icon-sound": "https://creation.bcmcdn.com/716/appcraft/IMAGE_tFMqlqJNs_1753342398805.svg",
    "icon-sound-library-primary": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ynqW4ZEkbp3_1753342119653.svg",
    "icon-sound-pause": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HfN_14VLRnB_1753342119656.svg",
    "icon-sound-play": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Q3C_dNrGtSL_1753342119660.svg",
    "icon-source-cloud-data": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-X-MWae3cO3_1753342119663.svg",
    "icon-source-table-data": "https://creation.bcmcdn.com/716/appcraft/IMAGE_JGYiSuD_D-i_1753342119666.svg",
    "icon-start": "https://creation.bcmcdn.com/716/appcraft/IMAGE_FaGm872jtmk_1753342119667.svg",
    "icon-start-first-screen": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Jk97BnZdgZR_1753342119669.svg",
    "icon-stop": "https://creation.bcmcdn.com/716/appcraft/IMAGE_F1J-Ih2YD_f_1753342119672.svg",
    "icon-storage-edit": "https://creation.bcmcdn.com/716/appcraft/IMAGE_bVPDljmch90_1753342119675.svg",
    "icon-stretch": "https://creation.bcmcdn.com/716/appcraft/IMAGE_t2GQ1YKlSzj_1753342119673.svg",
    "icon-stretch-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_RskaL25lhXF_1753342119677.svg",
    "icon-style-selected": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Ysok00G1id9_1753342119678.svg",
    "icon-surprise": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ANpvj2wbtE0_1753342119693.svg",
    "icon-title": "https://creation.bcmcdn.com/716/appcraft/IMAGE_c0cqda3TVsX_1753342119696.svg",
    "icon-toolbox-control": "https://creation.bcmcdn.com/716/appcraft/IMAGE_N2xYYuNXqbT_1753342119699.svg",
    "icon-toolbox-event": "https://creation.bcmcdn.com/716/appcraft/IMAGE_HgkNExjqX85_1753342119702.svg",
    "icon-toolbox-feature": "https://creation.bcmcdn.com/716/appcraft/IMAGE_u5cvXzJbv00_1753342119705.svg",
    "icon-toolbox-function": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Y0tAorHfZJv_1753342119707.svg",
    "icon-toolbox-list": "https://creation.bcmcdn.com/716/appcraft/IMAGE_S_mpAztbc4-_1753342119708.svg",
    "icon-toolbox-object": "https://creation.bcmcdn.com/716/appcraft/IMAGE_sFppfog8XYL_1753342119711.svg",
    "icon-toolbox-operation": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Uv0Nq2iILgc_1753342119713.svg",
    "icon-toolbox-variable": "https://creation.bcmcdn.com/716/appcraft/IMAGE_TCpD9prLeSL_1753342119718.svg",
    "icon-trumpet": "https://creation.bcmcdn.com/716/appcraft/IMAGE_qracT6O2InA_1753342119719.svg",
    "icon-turn-edit": "https://creation.bcmcdn.com/716/appcraft/IMAGE_DMZ0sfGkjvI_1753342119721.svg",
    "icon-undo": "https://creation.bcmcdn.com/716/appcraft/IMAGE_KmkxaHpH5Xo_1753342119722.svg",
    "icon-unlocked": "https://creation.bcmcdn.com/716/appcraft/IMAGE_eNnZZpI83Ev_1753342119725.svg",
    "icon-up": "https://creation.bcmcdn.com/716/appcraft/IMAGE_x8248o4OGlg_1753342119727.svg",
    "icon-upload": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ZpYw1hjYElG_1753342119732.svg",
    "icon-upload-image": "https://creation.bcmcdn.com/716/appcraft/IMAGE_xsdYM66nla__1753342119734.svg",
    "icon-upload-image-by-link": "https://creation.bcmcdn.com/716/appcraft/IMAGE_7z1YjyeG0Y6_1753342119737.svg",
    "icon-use": "https://creation.bcmcdn.com/716/appcraft/IMAGE_QRJmwc-RLhO_1753342119739.svg",
    "icon-use_disable": "https://creation.bcmcdn.com/716/appcraft/IMAGE_x35V76bNq0d_1753342119741.svg",
    "icon-vertical": "https://creation.bcmcdn.com/716/appcraft/IMAGE_xMXCRJwMjzI_1753342119742.svg",
    "icon-vertical-active": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-xBarjuzChq_1753342119744.svg",
    "icon-vertical-bottom": "https://creation.bcmcdn.com/716/appcraft/IMAGE_jVTJ2FfbxQf_1753342119755.svg",
    "icon-vertical-center": "https://creation.bcmcdn.com/716/appcraft/IMAGE_yAjSIxJWl5P_1753342119758.svg",
    "icon-vertical-top": "https://creation.bcmcdn.com/716/appcraft/IMAGE_6nX_m3WGP09_1753342119760.svg",
    "icon-video": "https://creation.bcmcdn.com/716/appcraft/IMAGE_-Sj1rOWvAXo_1753342119764.svg",
    "icon-warning": "https://creation.bcmcdn.com/716/appcraft/IMAGE_rK1ItY2wWTf_1753342119769.svg",
    "icon-watch-database": "https://creation.bcmcdn.com/716/appcraft/IMAGE_UhDJo_KTeN1_1753342119773.svg",
    "icon-watch-dict": "https://creation.bcmcdn.com/716/appcraft/IMAGE_yaN85nQtHeC_1753342119778.svg",
    "icon-watch-filter": "https://creation.bcmcdn.com/716/appcraft/IMAGE_bzHyBq2l18m_1753342119784.svg",
    "icon-watch-list": "https://creation.bcmcdn.com/716/appcraft/IMAGE_uUyJvVWBKpF_1753342119788.svg",
    "icon-watch-tabledata": "https://creation.bcmcdn.com/716/appcraft/IMAGE_ahX3twngppG_1753342119789.svg",
    "icon-watch-variable": "https://creation.bcmcdn.com/716/appcraft/IMAGE_SyzZbgm9mBQ_1753342119791.svg",
    "icon-widget-actor": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Mi6zx29Pr6v_1753342119792.svg",
    "icon-widget-aqara": "https://creation.bcmcdn.com/716/appcraft/IMAGE_OB8ftWYfSqR_1753342119795.svg",
    "icon-widget-audio": "https://creation.bcmcdn.com/716/appcraft/IMAGE_seWUEsLCQi4_1753342119802.svg",
    "icon-widget-brush": "https://creation.bcmcdn.com/716/appcraft/IMAGE_POBnJpblu7F_1753342119805.svg",
    "icon-widget-button": "https://creation.bcmcdn.com/716/appcraft/IMAGE_M5u4hkme3g8_1753342119809.svg",
    "icon-widget-camera": "https://creation.bcmcdn.com/716/appcraft/IMAGE_cZBOKbYmKjc_1753342119812.svg",
    "icon-widget-canvas": "https://creation.bcmcdn.com/716/appcraft/IMAGE_WHjr_yVWKGL_1753342119818.svg",
    "icon-widget-checkbox": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Kje_cZ8tXaT_1753342119819.svg",
    "icon-widget-cloud-db": "https://creation.bcmcdn.com/716/appcraft/IMAGE_PdT_uL51Onb_1753342119821.svg",
    "icon-widget-cloud-dict": "https://creation.bcmcdn.com/716/appcraft/IMAGE_6rZTheMPzk0_1753342119824.svg",
    "icon-widget-cloud-room": "https://creation.bcmcdn.com/716/appcraft/IMAGE_cfV1tm0nBW3_1753342119826.svg",
    "icon-widget-cloud-storage": "https://creation.bcmcdn.com/716/appcraft/IMAGE_bbEhGs4krm3_1753342119828.svg",
    "icon-widget-cloud-table": "https://creation.bcmcdn.com/716/appcraft/IMAGE_pzvmOHdQftF_1753342119831.svg",
    "icon-widget-contact-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_hpw_l-u4iO5_1753342119833.svg",
    "icon-widget-date-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_qdT5loABk6M_1753342119836.svg",
    "icon-widget-fold": "https://creation.bcmcdn.com/716/appcraft/IMAGE_rp2Ku0pwh5C_1753342119838.svg",
    "icon-widget-gyroscope": "https://creation.bcmcdn.com/716/appcraft/IMAGE_OsQ2VCuYcEH_1753342119842.svg",
    "icon-widget-http-client": "https://creation.bcmcdn.com/716/appcraft/IMAGE_PC0U966KeuM_1753342119840.svg",
    "icon-widget-image": "https://creation.bcmcdn.com/716/appcraft/IMAGE_eKUu6MthwPH_1753342119848.svg",
    "icon-widget-input": "https://creation.bcmcdn.com/716/appcraft/IMAGE_tNhveQHIW6B_1753342119844.svg",
    "icon-widget-kano-wand": "https://creation.bcmcdn.com/716/appcraft/IMAGE_nLiaMesi1PW_1753342119850.svg",
    "icon-widget-list-viewer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_YmTUAWW3rRN_1753342119854.svg",
    "icon-widget-local-storage": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Q9JQlEJ0TYi_1753342119855.svg",
    "icon-widget-old-button": "https://creation.bcmcdn.com/716/appcraft/IMAGE_2UeNvs0bw9M_1753342119857.svg",
    "icon-widget-pedometer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_FUr3xYd42eo_1753342119859.svg",
    "icon-widget-phone-dialer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Id5G-6Ak4rQ_1753342119862.svg",
    "icon-widget-qrcode": "https://creation.bcmcdn.com/716/appcraft/IMAGE_qJiiUTiFlFv_1753342119865.svg",
    "icon-widget-radio": "https://creation.bcmcdn.com/716/appcraft/IMAGE_DGrx44ECrUv_1753342119867.svg",
    "icon-widget-slider copy 10": "https://creation.bcmcdn.com/716/appcraft/IMAGE_oaqjV4GUeMK_1753342119870.svg",
    "icon-widget-slider": "https://creation.bcmcdn.com/716/appcraft/IMAGE_83G2aWC1r5T_1753342119872.svg",
    "icon-widget-sms-service": "https://creation.bcmcdn.com/716/appcraft/IMAGE_lTb7_YfoGd8_1753342119873.svg",
    "icon-widget-switch": "https://creation.bcmcdn.com/716/appcraft/IMAGE_jz7IvffAl5b_1753342119875.svg",
    "icon-widget-table-data": "https://creation.bcmcdn.com/716/appcraft/IMAGE_8zUN6Pdsay4_1753342119876.svg",
    "icon-widget-text": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Vjhk5e1DxAg_1753342119878.svg",
    "icon-widget-time-picker": "https://creation.bcmcdn.com/716/appcraft/IMAGE_Mmwx1wbXaj7_1753342119883.svg",
    "icon-widget-timer": "https://creation.bcmcdn.com/716/appcraft/IMAGE_WMblFmeLz_E_1753342119885.svg",
    "icon-widget-volume-sensor": "https://creation.bcmcdn.com/716/appcraft/IMAGE_aWjp52Mb-QE_1753342119893.svg",
    "icon-widget-web-view": "https://creation.bcmcdn.com/716/appcraft/IMAGE_EC0cAvA1slW_1753342119894.svg",
    "icon-yes": "https://creation.bcmcdn.com/716/appcraft/IMAGE_In1ONvmL7w2_1753342119899.svg",
    "icon-zoom-in": "https://creation.bcmcdn.com/716/appcraft/IMAGE_wOBFyLUOAUO_1753342119904.svg",
    "icon-zoom-out": "https://creation.bcmcdn.com/716/appcraft/IMAGE_eJ_3yf1c1TB_1753342119905.svg"
}
