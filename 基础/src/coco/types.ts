export type Types = {
    type: string
    title: string
    icon: string
	version?: `${number}.${number}.${number}` | string | undefined
    docs?: {
        url?: string | undefined
    } | undefined
    platforms?: Platforms | undefined
    isInvisibleWidget: boolean
    isGlobalWidget: boolean
    hasAnyWidget?: boolean | undefined
    properties: PropertyTypes[]
    methods: MethodTypes[]
    events: EventTypes[]
}

export type Platforms = ("web" | "android" | "ios")[]

export type PropertyTypes = {
    key: string
    label: string
    hidePropertyEditor?: boolean | undefined
    blockOptions?: PropertyBlockOptionsTypes | undefined
    validators?: {
        lessThan?: number | {
            value?: number | undefined
            message?: string | undefined
        } | undefined
        greaterThan?: number | {
            value?: number | undefined
            message?: string | undefined
        } | undefined
        lessThanOrEqualTo?: number | {
            value?: number | undefined
            message?: string | undefined
        } | undefined
        greaterThanOrEqualTo?: number | {
            value?: number | undefined
            message?: string | undefined
        } | undefined
        isInteger?: boolean | undefined
        notEmpty?: {
            value?: number | undefined
            message?: string | undefined
            maxLength?: number | undefined
            minLength?: number | undefined
        }
    } | undefined
    readonly?: 0 | 1 | undefined
    unit?: string | undefined
} & PropertyValueTypes

export type PropertyValueTypes = {
    editorType?: EditorType | undefined
} & CommonAfferentValueTypes | DropdownTypes

export type PropertyBlockOptionsTypes = {
    generateBlock?: boolean | undefined
    line?: string | undefined
    space?: number | undefined
    order?: number | undefined
    getter?: PropertyCalculatorBlockOptionsTypes | undefined
    setter?: PropertyCalculatorBlockOptionsTypes | undefined
}

export type PropertyCalculatorBlockOptionsTypes = {
    generateBlock?: boolean | undefined
    line?: string | undefined
    space?: number | undefined
    order?: number | undefined
    keys?: string[] | undefined
}

export type MethodTypes = {
    key: string
    label?: string | undefined
    params: MethodParamTypes[]
    tooltip?: string | undefined
    blockOptions?: MethodBlockOptionsTypes | undefined
} & MethodValueTypes

export type MethodParamTypes = {
    key: string
    label?: string | undefined
    labelAfter?: string | undefined
    controller?: {
        min?: number | undefined
        max?: number | undefined
    } & ({
        leftText?: undefined
        rightText?: undefined
    } | {
        leftText: string
        rightText: string
    }) | undefined
} & MethodParamValueTypes

export type MethodParamValueTypes = CommonAfferentValueTypes | DropdownTypes

export type MethodValueTypes = {
    valueType?: ValueType | undefined
}

export type MethodBlockOptionsTypes = {
    generateBlock?: boolean | undefined
    line?: string | undefined
    space?: number | undefined
    order?: number | undefined
    icon?: string | undefined
    color?: string | undefined
    inputsInline?: boolean | undefined
    callMethodLabel?: boolean | string | undefined
}

export type EventTypes = {
    key: string
    subTypes?: EventSubType[] | undefined
    label: string
    params: EventParamTypes[]
    tooltip?: string | undefined
    blockOptions?: EventBlockOptionsTypes | undefined
}

export type EventSubType = {
    key: string
} & DropdownTypes

export type EventParamTypes = {
    key: string
    label: string
} & EventParamValueTypes

export type EventParamValueTypes = {
    valueType: ValueType
}

export type EventBlockOptionsTypes = {
    generateBlock?: boolean | undefined
    line?: string | undefined
    space?: number | undefined
    order?: number | undefined
    icon?: string | undefined
}

export type CommonAfferentValueTypes = {
    valueType: ValueType
    checkType?: CheckType | undefined
    defaultValue: number | string | boolean
}

export type DropdownTypes = {
    dropdown: DropdownItemTypes[]
}

export type DropdownItemTypes = {
    label: string
    value: string
}

export type ValueType = SignalValueType | SignalValueType[]

export type SignalValueType = "string" | "number" | "boolean" | "object" | "array" | "color" | "image" | "icon" | "multilineString" | "richTextString"

export type CheckType = "string" | "number" | "boolean" | "object" | "array" | "color" | "image"

export type EditorType = "Align" | "TextInput" | "InputNumber" | "Color" | "VisibleSwitch" | "DisabledSwitch" | "InputMode" | "InputSizeType" | "InputTextGroup" | "InputSettingGroup" | "InputBackground" | "Coordinate" | "Size" | "TextArea" | "FontFamily" | "BackgroundColor" | "HorizontalAlign" | "VerticalAlign" | "ButtonSizeType" | "ButtonTextGroup" | "ButtonIconGroup" | "ButtonBackground" | "ButtonMode" | "ChangeImage" | "WidgetTitle" | "Headline" | "Options" | "RadioMode" | "RadioSizeType" | "CheckboxSizeType" | "SliderDirection" | "SwitchMode" | "SwitchSizeType" | "SwitchBackground" | "SliderMode" | "SliderRange" | "NumberInputRow" | "DegreeInputRow" | "FlipInputRow" | "ScaleInputRow" | "StyleEditorSwitch" | "AudioChangeSoundFile" | "AudioVolume" | "AudioRate" | "LocalStorageFields" | "HttpBody" | "HttpHeader" | "HttpParams" | "ListNewDataSource" | "ListViewerDataSource" | "ListViewerStyleTemplate" | "OptionSwitch" | "PreviewImage" | "Select" | "HelpUrl" | "CloudDbList" | "AntSwitch" | "WidgetOpacity" | "TextWidgetTextGroup" | "TableData" | "RichTextEditor" | "NumberSlider" | "BrushDrawProcess" | "BrushPenColor" | "DictFields" | "TableFields" | "WarningFields" | "BluetoothConnect" | "AqaraAuth"
