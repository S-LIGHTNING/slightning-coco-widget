import { addCheck, addThisForMethods, ArrayType, CoCo, Color, CreationProject, emit, exportWidget, flattenEventSubTypes, FunctionType, generateBlockForProperties, generateMethodForFunctions, getSuperWidget, IntegerType, Logger, MethodBlockParam, ObjectType, StringType, transformIcons, transformIconsExceptWidgetIcon, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, transformMethodsThrows, Types } from "slightning-coco-widget"
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
            type: new StringType({
                defaultValue: "测试属性默认键默认计算函数默认值"
            })
        }, {
            key: "testPropertyCustomKeyDefaultCalculateMethod",
            label: "测试属性自定义键默认计算函数",
            type: new StringType({
                defaultValue: "测试属性自定义键默认计算函数默认值"
            }),
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
            type: new StringType({
                defaultValue: "测试属性自定义键自定义计算函数默认值"
            }),
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
    methods: [{
        blockOptions: {
            icon: "icon-widget-radio",
            color: Color.RED
        },
        contents: [
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
            }, {
                contents: [
                    {
                        key: "emitTestEvent",
                        label: "触发测试事件",
                        block: [
                            MethodBlockParam.METHOD
                        ]
                    }
                ]
            }, {
                label: "内部",
                contents: [
                    {
                        key: "exportedWidgetTypes",
                        label: "导出的控件类型定义",
                        block: [MethodBlockParam.METHOD],
                        returns: new ObjectType()
                    }
                ]
            }
        ]
    }],
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
            params: [
                {
                    key: "function",
                    label: "函数",
                    type: new FunctionType({
                        block: []
                    })
                }
            ]
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
        }
    ]
}

let exportedWidgetTypes: CoCo.Types | CreationProject.Types

class TestBaseWidget extends getSuperWidget(types) {

    private logger: Logger

    public testPropertyCustomKeyCustomCalculateMethod!: string

    public constructor(props: unknown) {
        super(props)
        this.logger = new Logger(types, this)
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

    public testEvent(this: this): void {
        this.logger.log("测试事件传出函数被调用")
        emit.call(this, "onTestEvent", (): void => {
            this.logger.log("事件传出函数函数被调用")
        })
    }

    public testMethod(): void {
        this.logger.log("异常捕获测试方法被调用")
        throw new Error("异常，这是一个测试异常")
    }

    public exportedWidgetTypes(): CoCo.Types | CreationProject.Types {
        return exportedWidgetTypes
    }
}

exportWidget(types, TestBaseWidget, {
    decorators: [
        generateMethodForFunctions,
        generateBlockForProperties,
        transformMethodsThrows
    ],
    CoCo: {
        decorators: [
            transformMethodsCallbackFunctionsToEvents,
            addThisForMethods,
            addCheck,
            transformIconsExceptWidgetIcon
        ]
    },
    CreationProject: {
        decorators: [
            flattenEventSubTypes,
            transformMethodsCallbackFunctionsToCodeBlocks,
            addThisForMethods,
            addCheck,
            transformIcons
        ]
    }
})

exportedWidgetTypes = _.cloneDeep(
    CoCo.widgetExports.types ??
    CreationProject.widgetExports.type ??
    ((): never => {
        throw new Error("找不到导出的控件类型定义")
    })()
)
