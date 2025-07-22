import { addCheck, addThisForMethods, AnyType, ArrayType, AudioType, CoCo, Color, ColorType, CreationProject, emit, exportWidget, FunctionType, generateBlockForProperties, getSuperWidget, ImageType, IntegerType, MethodBlockParam, ObjectType, StringEnumType, StringType, transformIcons, transformIconsExceptWidgetIcon, Types, UnionType, VideoType, flattenEventSubTypes, generateMethodForFunctions, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, transformMethodsThrows, InstanceOfClassType, MutatorType, transformMutator, StringInputType } from "slightning-coco-widget"
import _ from "lodash"

const types: Types = {
    type: "SLIGHTNING_TEST_BASE_WIDGET",
    info: {
        title: "测试基础功能",
        icon: "icon-widget-radio",
        category: "测试 SCW",
        version: "2.5.0",
        url: {
            homepage: "https://s-lightning.github.io/slightning-coco-widget/",
            docs: "https://s-lightning.github.io/slightning-coco-widget/",
            repository: "https://gitee.com/slightning/slightning-coco-widget",
            bugReport: "https://gitee.com/slightning/slightning-coco-widget/issues/new",
        }
    },
    options: {
        visible: false,
        global: false
    },
    properties: [
        [
            "testPropertyDefaultKeyDefaultCalculateMethod",
            "测试属性默认键默认计算函数",
            "测试属性默认键默认计算函数默认值"
        ], [
            "testPropertyCustomKeyDefaultCalculateMethod",
            "测试属性自定义键默认计算函数",
            "测试属性自定义键默认计算函数默认值",
            { blockOptions: {
                get: { key: "customKeyDefaultGet" },
                set: { key: "customKeyDefaultSet" }
            } }
        ], [
            "testPropertyCustomKeyCustomCalculateMethod",
            "测试属性自定义键自定义计算函数",
            "测试属性自定义键自定义计算函数默认值",
            { blockOptions: {
                get: { key: "customKeyCustomGet" },
                set: { key: "customKeyCustomSet" }
            }}
        ]
    ],
    methods: [{ blockOptions: {
        icon: "icon-widget-radio",
        color: Color.RED
    }, contents: [
        {
            label: "测试组",
            contents: [
                {
                    label: "测试子组",
                    contents: [
                        ["testGroupMethod", "测试组方法", [
                            MethodBlockParam.THIS, MethodBlockParam.METHOD
                        ]]
                    ]
                }, {
                    label: "测试无标签组",
                    contents: [
                        { contents: [
                            ["testGroupWithoutLabelMethod1", "测试无标签组方法1", [
                                MethodBlockParam.THIS, MethodBlockParam.METHOD
                            ]]
                        ]},
                        { contents: [
                            ["testGroupWithoutLabelMethod2", "测试无标签组方法2", [
                                MethodBlockParam.THIS, MethodBlockParam.METHOD
                            ]]
                        ]}
                    ]
                }
            ]
        }, { label: "事件", blockOptions: {
            color: Color.BLUE
        }, contents: [
            ["emitTestEvent", "触发测试事件", [MethodBlockParam.METHOD]],
            ["emitTestEventSubTypes", "触发测试事件子类型", [
                "触发", "测试事件子类型",
                ["subType1", "子类型1", [
                    ["测试1", "test1"],
                    ["测试2", "test2"]
                ]],
                ["subType2", "子类型2", [
                    ["测试3", "test3"],
                    ["测试4", "test4"]
                ]]
            ]]
        ]}, { label: "方法", blockOptions: {
            color: Color.CYAN
        }, contents: [
            ["testMethodText", "测试方法说明文本", [
                "0", MethodBlockParam.METHOD, "1", MethodBlockParam.THIS, "2", MethodBlockParam.METHOD, "3",
                ["string", "字符串", "字符串"],
                "4", MethodBlockParam.METHOD, "5"
            ]],
            ["testMultilineMethod", "测试方法多行积木", [
                "0", MethodBlockParam.METHOD, "1", MethodBlockParam.THIS, "2", MethodBlockParam.METHOD, "3", MethodBlockParam.BREAK_LINE,
                MethodBlockParam.METHOD, "宽度", ["width", "宽度", 300], "px", MethodBlockParam.BREAK_LINE,
                MethodBlockParam.METHOD, "高度", ["height", "高度", 300], "px"
            ],, { blockOptions: { inline: false } }],
            ["testMethodParams", "测试方法参数", [
                ["string", "字符串", "字符串"],
                ["multilineString", "多行字符串", new StringType({
                    defaultValue: "多行\n字符串",
                    inputType: StringInputType.MULTILINE
                })],
                ["integer", "整数", new IntegerType(0)],
                ["number", "数字", 0],
                ["boolean", "布尔", false],
                ["any", "任意", new AnyType({ defaultValue: null })],
                ["stringEnum", "字符串枚举", new StringEnumType([
                    ["选项1", "option1"],
                    ["选项2", "option2"]
                ])],
                ["object", "字典", new ObjectType({
                    propertiesType: {
                        property1: new StringType("属性1"),
                        property2: new IntegerType(0)
                    }
                })],
                ["array", "列表", new ArrayType({
                    itemType: new StringType("列表项")
                })],
                ["color", "颜色", new ColorType(Color.BLUE)],
                ["image", "图片", new ImageType()],
                ["audio", "音频", new AudioType()],
                ["video", "视频", new VideoType()],
                ["union", "联合", new UnionType<string | number>(
                    new StringType("联合"), new IntegerType()
                )],
                ["instance", "实例", new InstanceOfClassType(Object)],
                ["function", "函数", new FunctionType({
                    block: [
                        ["param1", "参数1", "参数1"],
                        ["param2", "参数2", new IntegerType(0)]
                    ],
                    returns: new AnyType(),
                    throws: new AnyType()
                })]
            ],, {
                blockOptions: { inline: false }
            }],
            ["testMethodThrowsNoReturns", "测试方法无返回值抛出异常", [
                MethodBlockParam.METHOD,
                ["type", "类型", new StringEnumType([
                    ["返回", "returns"],
                    ["抛出", "throws"]
                ])]
            ],, { throws: new AnyType() }
            ],
            ["testMethodThrowsWithReturns", "测试方法有返回值抛出异常", [
                MethodBlockParam.METHOD,
                ["type", "类型", new StringEnumType([
                    ["返回", "returns"],
                    ["抛出", "throws"]
                ])]
            ], new AnyType(), { throws: new AnyType() }],
            ["testMethodCallbackFunction", "测试方法回调函数", [
                MethodBlockParam.METHOD,
                ["callback", "回调", new FunctionType({
                    block: [],
                    returns: new StringType(),
                    throws: new StringType()
                })]
            ], new StringType()],
            ["testMethodEfferentFunction", "测试方法传出函数", [
                MethodBlockParam.METHOD,
                ["callback", "回调", new FunctionType({
                    block: [["function", "函数", new FunctionType({ block: [] })]]
                })]
            ], new UnionType<unknown>(
                new ObjectType({ propertiesType: { "函数": new FunctionType({ block: [] }) } }),
                new ArrayType({ itemType: new FunctionType({ block: [] }) })
            )],
            ["testMethodMutatorParam", "测试方法变更器参数", [
                MethodBlockParam.THIS, MethodBlockParam.BREAK_LINE,
                MethodBlockParam.METHOD,
                ["mutator", "变更器", new MutatorType({
                    block: [
                        MethodBlockParam.BREAK_LINE, ["key", "键", "键"], ":",
                        ["value", "值", new AnyType("值")]
                    ],
                    separator: ",",
                    min: 0,
                    defaultNumber: 1
                })]
            ], new ObjectType(), {
                blockOptions: { inline: false }
            }]
        ]}, { label: "内部", contents: [
            ["exportedWidgetTypes", "导出的控件类型定义", [MethodBlockParam.METHOD], new ObjectType()]
        ]}
    ]}],
    events: [
        ["onCustomKeyCustomGet", "自定义键自定义获取", []],
        ["onCustomKeyCustomSet", "自定义键自定义设置", []],
        ["onTestEvent", "测试事件", []],
        ["onTestEventSubTypes", "测试事件子类型", [
            ["subType0", [
                [ "测试1", "test1" ],
                [ "测试2", "test2" ]
            ]],
            ["subType1", [
                [ "测试3", "test3" ],
                [ "测试4", "test4" ]
            ]]
        ], []],
        ["onEfferentFunctionCalled", "传出函数被调用", []],
        ["onTestEventEfferentFunction", "测试事件传出函数", [
            ["function", "函数", new FunctionType({ block: [] })]
        ]]
    ]
}

let exportedWidgetTypes: CoCo.Types | CreationProject.Types | undefined

class TestBaseWidget extends getSuperWidget(types) {

    public testPropertyCustomKeyCustomCalculateMethod!: string

    public constructor(props: unknown) {
        super(props)
    }

    public customKeyCustomGet(this: this): string {
        emit.call(this, "onCustomKeyCustomGet")
        return this.testPropertyCustomKeyCustomCalculateMethod
    }

    public customKeyCustomSet(this: this, value: string): void {
        emit.call(this, "onCustomKeyCustomSet")
        this.testPropertyCustomKeyCustomCalculateMethod = value
    }

    public emitTestEvent(this: this): void {
        emit.call(this, "onTestEvent")
    }

    public emitTestEventSubTypes(
        this: this,
        subType1: "test1" | "test2",
        subType2: "test3" | "test4"
    ): void {
        emit.call(this, `onTestEventSubTypes${_.capitalize(subType1)}${_.capitalize(subType2)}`)
    }

    public testMethodThrowsNoReturns(this: this, type: "returns" | "throws"): void {
        if (type == "throws") {
            throw new Error("测试方法无返回值抛出异常")
        }
    }

    public testMethodThrowsWithReturns(this: this, type: "returns" | "throws"): any {
        if (type == "throws") {
            throw new Error("测试方法有返回值抛出异常")
        }
        return "返回值"
    }

    public async testMethodCallbackFunction(
        this: this,
        callback: () => string | Promise<string>
    ): Promise<string> {
        try {
            return `返回：${await callback()}`
        } catch (error) {
            return `异常：${error}`
        }
    }

    public testMethodEfferentFunction(
        this: this,
        callback: (theFunction: () => void) => void | Promise<void>
    ): void | Promise<void> {
        return callback((): void => {
            emit.call(this, "onEfferentFunctionCalled")
        })
    }

    public testMethodMutatorParam(
        mutator: { key: string, value: unknown }[]
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {}
        for (const item of mutator) {
            result[item.key] = item.value
        }
        return result
    }

    public exportedWidgetTypes(): CoCo.Types | CreationProject.Types {
        if (exportedWidgetTypes == undefined) {
            throw new Error("找不到导出的控件类型定义")
        }
        return exportedWidgetTypes
    }
}

exportWidget(types, TestBaseWidget, {
    decorators: [
        { "CoCo|CreationProject": [
            generateBlockForProperties,
            generateMethodForFunctions,
            transformMethodsThrows
        ]},
        { CreationProject: flattenEventSubTypes },
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        },
        addThisForMethods,
        addCheck,
        {
            "CoCo|CreationProject": transformMutator
        }, {
            CoCo: transformIconsExceptWidgetIcon,
            CreationProject: transformIcons
        }
    ]
})

exportedWidgetTypes = _ == undefined ? undefined : _.cloneDeep(
    CoCo.widgetExports.types ??
    CreationProject.widgetExports.type ??
    undefined
)

console.log("导出的控件类型定义：", exportedWidgetTypes)
