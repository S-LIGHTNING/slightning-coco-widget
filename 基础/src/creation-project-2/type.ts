/**
 * 本文件内容来自 https://www.yuque.com/zaona/cp/widget_apis#Wlez3，有修改
 */

import { WidgetInterface } from "./widget"

export type Types = {
    type: string
    label: string
    icon: string
    visibleWidget: boolean
    category?: string | undefined
    default?: {
        width?: number | undefined
        height?: number | undefined
    } | undefined
    color?: string | undefined
    emits: EmitTypes[]
    methods: MethodTypes[]
    props: PropTypes[]
    noPropFlyout?: boolean | undefined
    staticWidget?: boolean | undefined
    noMovaable?: boolean | undefined
    global: boolean
    common?: boolean | undefined
    noPreprocess?: boolean | undefined
    rawBlocklyWidget?: boolean | undefined
    rawBlocks?: any | undefined
    rawFlyout?: any | undefined
    noContextMenu?: boolean | undefined
    noWidgetsBoxItem?: boolean | undefined
}

export type PropTypes = {
    key: string
    label: string
    compact?: boolean | undefined
    /**
     * @deprecated 此属性已删除
     */
    changeCallback?: string | undefined
    extData?: any | undefined
    showEditor?: boolean | undefined
    noBlock?: boolean | undefined
    blockOptions?: {
        group?: string | undefined
        getter?: BlockOptions | undefined
        setter?: BlockOptions | undefined
    } | undefined
} & PropValueTypes

export type PropValueTypes = (AfferentValueTypes | FontValueTypes | {
    valueType: "custom"
    defaultValue?: string | number | boolean | any | undefined
}) & {
    editorType?: ValueType | string | undefined
}

export type FontValueTypes = {
    valueType: "font"
    defaultValue?: ({
        fontFamily?: Exclude<string, "custom"> | undefined
    } | {
        fontFamily: "custom"
        customFontUrl: string
    }) & {
        fontSize?: number | undefined
        fontColor?: string | undefined
    }
}

export type MethodTypes = {
    key: string
    label?: string | undefined
    valueType?: ValueType | "code" | string | undefined
    params: MethodParamTypes[]
    static?: boolean | undefined
    nativeBlocklyFlyout?: any | undefined
    fn?: ((this: WidgetInterface, ...arg: any[]) => any) | undefined
    blockOptions?: BlockOptions | undefined
} & MethodValueTypes

export type MethodParamTypes = {
    key: string
    label?: string | undefined
    labelAfter?: string | undefined
    rawBlocklyCheck?: any | undefined
    codeNotBreakLine?: boolean | undefined
    runtimeFn?: boolean | undefined
    cclType?: "string" | "boolean" | "number" | undefined
} & MethodParamValueTypes

export type MethodParamValueTypes = AfferentValueTypes | {
    valueType: "any"
    defaultValue?: number | string | boolean | null | object | undefined
} | MutatorTypes | CodeTypes

export type MutatorTypes = {
    valueType: "mutator"
    mutator?: MethodParamTypes[] | undefined
    mutatorMax?: number | undefined
    mutatorMin?: number | undefined
    mutatorItem?: number | undefined
}

export type CodeTypes = {
    valueType: "code"
    codeParams?: MethodParamCodeParamTypes[] | undefined
}

export type MethodParamCodeParamTypes = {
    key: string
    label: string
} & EfferentValueTypes

export type MethodValueTypes = {
    valueType?: ValueType | "code" | string | undefined
}

export type EmitTypes = {
    key: string
    label: string
    params: EmitParamTypes[]
}

export type EmitParamTypes = {
    key: string
    label: string
} & EmitParamValueTypes

export type EmitParamValueTypes = EfferentValueTypes

export type BlockOptions = {
    nextStatement?: boolean | undefined
    previousStatement?: boolean | undefined
    generateBlock?: boolean | undefined
    inputsInline?: boolean | undefined
    tooltip?: string | undefined
    outputCheck?: string | null | undefined
    line?: string | undefined
    gap?: number | undefined
    padding?: number | undefined
    color?: string | undefined
    prefix?: string | undefined
    suffix?: string | undefined
}

export type ValueType = "string" | "number" | "boolean" | "image" | "multilineString" | "array" | "object" | "color" | "audio" | "video"

export type AfferentValueTypes = CommonAfferentValueTypes | DropdownTypes

export type EfferentValueTypes = {
    valueType: ValueType
}

export type CommonAfferentValueTypes = {
    valueType: ValueType
    defaultValue?: number | string | boolean | null | object | undefined
}

export type DropdownTypes = {
    valueType: "dropdown"
    dropdown: [string, string][] | (() => [string, string][])
}
