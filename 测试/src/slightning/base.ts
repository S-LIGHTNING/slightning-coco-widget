import { addCheck, addThisForMethods, AnyType, ArrayType, AudioType, BooleanType, CoCo, Color, ColorType, CreationProject, emit, exportWidget, FunctionType, generateBlockForProperties, getSuperWidget, ImageType, IntegerType, MethodBlockParam, NumberType, ObjectType, StringEnumType, StringType, transformIcons, transformIconsExceptWidgetIcon, Types, UnionType, VideoType, flattenEventSubTypes, generateMethodForFunctions, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, transformMethodsThrows, InstanceOfClassType, MutatorType, transformMutator } from "slightning-coco-widget"
import _ from "lodash"

const types: Types = {
    type: "SLIGHTNING_TEST_BASE_WIDGET",
    info: {
        title: "测试基础功能",
        icon: "icon-widget-radio",
        category: "测试 SCW",
    },
    options: {
        visible: false,
        global: false
    },
    properties: [
        {
            key: "testPropertyDefaultKeyDefaultCalculateMethod",
            label: "测试属性默认键默认计算函数",
            type: new StringType("测试属性默认键默认计算函数默认值")
        }, {
            key: "testPropertyCustomKeyDefaultCalculateMethod",
            label: "测试属性自定义键默认计算函数",
            type: new StringType("测试属性自定义键默认计算函数默认值"),
            blockOptions: {
                get: {
                    key: "customKeyDefaultGet"
                },
                set: {
                    key: "customKeyDefaultSet"
                }
            }
        }, {
            key: "testPropertyCustomKeyCustomCalculateMethod",
            label: "测试属性自定义键自定义计算函数",
            type: new StringType("测试属性自定义键自定义计算函数默认值"),
            blockOptions: {
                get: {
                    key: "customKeyCustomGet"
                },
                set: {
                    key: "customKeyCustomSet"
                }
            }
        }
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
                        {
                            key: "testGroupMethod",
                            label: "测试组方法",
                            block: [
                                MethodBlockParam.THIS, MethodBlockParam.METHOD
                            ]
                        }
                    ]
                }, {
                    label: "测试无标签组",
                    contents: [
                        {
                            contents: [
                                {
                                    key: "testGroupWithoutLabelMethod1",
                                    label: "测试无标签组方法1",
                                    block: [
                                        MethodBlockParam.THIS, MethodBlockParam.METHOD
                                    ]
                                }
                            ]
                        }, {
                            contents: [
                                    {
                                    key: "testGroupWithoutLabelMethod2",
                                    label: "测试无标签组方法2",
                                    block: [
                                        MethodBlockParam.THIS, MethodBlockParam.METHOD
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }, { label: "事件", blockOptions: {
            color: Color.BLUE
        }, contents: [
            {
                key: "emitTestEvent",
                label: "触发测试事件",
                block: [
                    MethodBlockParam.METHOD
                ]
            }, {
                key: "emitTestEventSubTypes",
                label: "触发测试事件子类型",
                block: [
                    "触发", "测试事件子类型", {
                        key: "subType1",
                        label: "子类型1",
                        type: new StringEnumType([
                            { label: "测试1", value: "test1" },
                            { label: "测试2", value: "test2" }
                        ])
                    }, {
                        key: "subType2",
                        label: "子类型2",
                        type: new StringEnumType([
                            { label: "测试3", value: "test3" },
                            { label: "测试4", value: "test4" }
                        ])
                    }
                ]
            }
        ]}, { label: "方法", blockOptions: {
            color: Color.CYAN
        }, contents: [
            {
                key: "testMethodText",
                label: "测试方法说明文本",
                block: [
                    "0", MethodBlockParam.METHOD, "1", MethodBlockParam.THIS, "2", MethodBlockParam.METHOD, "3", {
                        key: "string",
                        label: "字符串",
                        type: new StringType("字符串")
                    }, "4", MethodBlockParam.METHOD, "5"
                ]
            }, {
                key: "testMethodParams",
                label: "测试方法参数",
                block: [
                    "字符串", {
                        key: "string",
                        label: "字符串",
                        type: new StringType("字符串")
                    }, "整数", {
                        key: "integer",
                        label: "整数",
                        type: new IntegerType(0)
                    }, "数字", {
                        key: "number",
                        label: "数字",
                        type: new NumberType(0)
                    }, "布尔", {
                        key: "boolean",
                        label: "布尔",
                        type: new BooleanType(false)
                    }, "任意", {
                        key: "any",
                        label: "任意",
                        type: new AnyType({ defaultValue: null })
                    }, "字符串枚举", {
                        key: "stringEnum",
                        label: "字符串枚举",
                        type: new StringEnumType([
                            { label: "选项1", value: "option1" },
                            { label: "选项2", value: "option2" }
                        ])
                    }, "字典", {
                        key: "object",
                        label: "字典",
                        type: new ObjectType({
                            propertiesType: {
                                property1: new StringType("属性1"),
                                property2: new IntegerType(0)
                            }
                        })
                    }, "列表", {
                        key: "array",
                        label: "列表",
                        type: new ArrayType({
                            itemType: new StringType("列表项")
                        })
                    }, "颜色", {
                        key: "color",
                        label: "颜色",
                        type: new ColorType(Color.BLUE)
                    }, "图片", {
                        key: "image",
                        label: "图片",
                        type: new ImageType()
                    }, "音频", {
                        key: "audio",
                        label: "音频",
                        type: new AudioType()
                    }, "视频", {
                        key: "video",
                        label: "视频",
                        type: new VideoType()
                    }, "联合", {
                        key: "union",
                        label: "联合",
                        type: new UnionType<string | number>(
                            new StringType("联合"), new IntegerType()
                        )
                    }, "实例", {
                        key: "instance",
                        label: "实例",
                        type: new InstanceOfClassType(Object)
                    }, "函数", {
                        key: "function",
                        label: "函数",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "param1",
                                    label: "参数1",
                                    type: new StringType("参数1")
                                }, {
                                    key: "param2",
                                    label: "参数2",
                                    type: new IntegerType(0)
                                }
                            ],
                            returns: new AnyType(),
                            throws: new AnyType()
                        })
                    }
                ]
            }, {
                key: "testMethodThrowsNoReturns",
                label: "测试方法无返回值抛出异常",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "type",
                        label: "类型",
                        type: new StringEnumType([
                            { label: "返回", value: "returns" },
                            { label: "抛出", value: "throws" }
                        ])
                    }
                ],
                throws: new AnyType()
            }, {
                key: "testMethodThrowsWithReturns",
                label: "测试方法有返回值抛出异常",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "type",
                        label: "类型",
                        type: new StringEnumType([
                            { label: "返回", value: "returns" },
                            { label: "抛出", value: "throws" }
                        ])
                    }
                ],
                returns: new AnyType(),
                throws: new AnyType()
            }, {
                key: "testMethodCallbackFunction",
                label: "测试方法回调函数",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "callback",
                        label: "回调",
                        type: new FunctionType({
                            block: [],
                            returns: new StringType(),
                            throws: new StringType()
                        })
                    }
                ],
                returns: new StringType(),
            }, {
                key: "testMethodEfferentFunction",
                label: "测试方法传出函数",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "callback",
                        label: "回调",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "function",
                                    label: "函数",
                                    type: new FunctionType({
                                        block: []
                                    })
                                }
                            ]
                        })
                    }
                ],
                returns: new UnionType<unknown>(
                    new ObjectType({
                        propertiesType: {
                            "函数": new FunctionType({
                                block: []
                            })
                        }
                    }),
                    new ArrayType({
                        itemType: new FunctionType({
                            block: []
                        })
                    })
                )
            }, {
                key: "testMethodMutatorParam",
                label: "测试方法变更器参数",
                block: [
                    MethodBlockParam.THIS, MethodBlockParam.METHOD, {
                        key: "mutator",
                        label: "变更器",
                        type: new MutatorType({
                            block: [
                                {
                                    key: "key",
                                    label: "键",
                                    type: new StringType("键")
                                }, ":", {
                                    key: "value",
                                    label: "值",
                                    type: new AnyType("值")
                                }, ","
                            ],
                            min: 0,
                            defaultNumber: 1
                        })
                    }
                ],
                returns: new ObjectType()
            }
        ]}, { label: "内部", contents: [
            {
                key: "exportedWidgetTypes",
                label: "导出的控件类型定义",
                block: [MethodBlockParam.METHOD],
                returns: new ObjectType()
            }
        ]}
    ]}],
    events: [
        {
            key: "onCustomKeyCustomGet",
            label: "自定义键自定义获取",
            params: []
        }, {
            key: "onCustomKeyCustomSet",
            label: "自定义键自定义设置",
            params: []
        }, {
            key: "onTestEvent",
            label: "测试事件",
            params: []
        }, {
            key: "onTestEventSubTypes",
            label: "测试事件子类型",
            subTypes: [
                {
                    key: "subType0",
                    dropdown: [
                        { label: "测试1", value: "test1" },
                        { label: "测试2", value: "test2" }
                    ]
                }, {
                    key: "subType1",
                    dropdown: [
                        { label: "测试3", value: "test3" },
                        { label: "测试4", value: "test4" }
                    ]
                }
            ],
            params: []
        }, {
            key: "onEfferentFunctionCalled",
            label: "传出函数被调用",
            params: []
        }, {
            key: "onTestEventEfferentFunction",
            label: "测试事件传出函数",
            params: [
                {
                    key: "function",
                    label: "函数",
                    type: new FunctionType({
                        block: []
                    })
                }
            ]
        }
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
        generateMethodForFunctions,
        generateBlockForProperties,
        transformMethodsThrows,
        { CreationProject: flattenEventSubTypes },
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        },
        addThisForMethods,
        addCheck,
        transformMutator,
        {
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
