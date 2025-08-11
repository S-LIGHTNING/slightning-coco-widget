/**
 * 本文件内容来自 https://www.yuque.com/zaona/cp/widget_apis_v1#nC37P，有修改。
 */

import { widgetClass } from "./widget"

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
    defaultValue?: string | number | boolean | any | undefined
    compact?: boolean | undefined
    noBlock?: boolean | undefined
    showEditor?: boolean | undefined
    blockOptions?: {
        group?: string | undefined
        setter?: BlockOptions | undefined
        getter?: BlockOptions | undefined
    } | undefined
    rawProp?: string | undefined
    extData?: any | undefined
    justVisibleWidget?: boolean | undefined
} & PropValueTypes

export type PropValueTypes = {
    editorType?: ValueType | "dropdown" | undefined
} & AfferentValueTypes

export type MethodTypes = {
    key: string
    label?: string | undefined
    valueType?: ValueType | "code" | string | undefined
    params: MethodParamTypes[]
    static?: boolean | undefined
    rawBlock?: any | undefined
    fn?: ((this: widgetClass, ...arg: any[]) => any) | undefined
    rawBlocklyCheck?: any | undefined
    blockOptions?: BlockOptions | undefined
}

export type MethodParamTypes = {
    key: string
    label?: string | undefined
    labelAfter?: string | undefined
    rawBlocklyCheck?: any | undefined
    dropdown?: [string, string][] | (() => [string, string][]) | undefined
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

export type ValueType = "string" | "number" | "boolean" | "image" | "multiline_string" | "array" | "object" | "color" | "audio" | "video"

export type AfferentValueTypes = CommonAfferentValueTypes | DropdownTypes

export type EfferentValueTypes = {
    valueType: ValueType | "any"
}

export type CommonAfferentValueTypes = {
    valueType: ValueType
    defaultValue?: number | string | boolean | null | object | undefined
}

export type DropdownTypes = {
    valueType: "dropdown"
    dropdown: [string, string][] | (() => [string, string][])
}

export type BlockOptions = {
    previousStatement?: boolean | undefined
    nextStatement?: boolean | undefined
    generateBlock?: boolean | undefined
    inputsInline?: boolean | undefined
    tooltip?: string | undefined
    line?: string | undefined
    gap?: number | undefined
    padding?: number | undefined
    color?: string | undefined
    prefix?: string | undefined
    suffix?: string | undefined
    fn?: ((...args: any[]) => any) | undefined
}
