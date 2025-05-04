import { addCheck, addThisForMethods, AnyType, ArrayType, BooleanType, Color, emit, exportWidget, flattenEventSubTypes, FunctionType, generateBlockForProperties, generateMethodForFunctions, getSuperWidget, InstanceType, IntegerType, Logger, MethodBlockParam, ObjectType, StringType, transformIcons, transformIconsExceptWidgetIcon, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, transformMethodsThrows, Types, VoidType } from "slightning-coco-widget"

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
            key: "width",
            label: "宽度",
            type: new IntegerType({
                defaultValue: 360
            })
        }, {
            key: "height",
            label: "高度",
            type: new IntegerType({
                defaultValue: 360
            })
        }, {
            key: "testProperty",
            label: "测试属性",
            type: new StringType({
                defaultValue: "默认值"
            })
        }
    ],
    methods: [
        {
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
                        }
                    ]
                }, {
                    key: "testTypes",
                    label: "测试方法",
                    block: [
                        MethodBlockParam.METHOD, "列表", {
                            key: "array",
                            label: "列表",
                            type: new ArrayType({
                                itemType: new StringType()
                            })
                        }, "字典", {
                            key: "object",
                            label: "字典",
                            type: new ObjectType({
                                propertiesType: {
                                    "整数": new IntegerType(),
                                    "字符串": new StringType()
                                }
                            })
                        }
                    ]
                }, {
                    key: "testMethod",
                    label: "测试方法",
                    block: [
                        "使", MethodBlockParam.THIS, MethodBlockParam.METHOD, "抛出异常"
                    ],
                    returns: new BooleanType(),
                    throws: new StringType()
                }, {
                    contents: [
                        {
                            key: "testEvent",
                            label: "测试事件",
                            block: [
                                MethodBlockParam.METHOD
                            ]
                        }
                    ]
                }
            ]
        }, {
            label: "承诺",
            blockOptions: {
                color: Color.CYAN
            },
            contents: [
                {
                    key: "newPromise",
                    label: "创建承诺",
                    block: [
                        MethodBlockParam.METHOD, {
                            key: "callback",
                            label: "回调",
                            type: new FunctionType({
                                block: [
                                    {
                                        key: "resolve",
                                        label: "解决",
                                        type: new FunctionType({
                                            block: [
                                                "结果", {
                                                    key: "value",
                                                    label: "结果",
                                                    type: new AnyType({
                                                        defaultValue: "结果"
                                                    })
                                                }
                                            ]
                                        })
                                    }, {
                                        key: "reject",
                                        label: "拒绝",
                                        type: new FunctionType({
                                            block: [
                                                "原因", {
                                                    key: "reason",
                                                    label: "原因",
                                                    type: new AnyType({
                                                        defaultValue: "原因"
                                                    })
                                                }
                                            ]
                                        })
                                    }
                                ]
                            })
                        }
                    ],
                    returns: new InstanceType({
                        theClass: Promise
                    })
                }
            ]
        }, {
            label: "循环",
            blockOptions: {
                color: Color.CYAN
            },
            contents: [
                {
                    key: "loop",
                    label: "循环",
                    block: [
                        MethodBlockParam.METHOD, {
                            key: "body",
                            label: "循环体",
                            type: new FunctionType({
                                block: [],
                                returns: new VoidType(),
                                throws: new InstanceType({
                                    theClass: Error
                                })
                            })
                        }
                    ]
                }
            ]
        }
    ],
    events: [
        {
            key: "onTestEvent",
            label: "测试事件",
            params: [
                {
                    key: "function",
                    label: "函数",
                    type: new FunctionType({
                        block: [
                            "测试函数"
                        ]
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

class TestBaseWidget extends getSuperWidget(types) {

    private logger: Logger

    public testProperty!: string

    public constructor(props: unknown) {
        super(props)
        this.logger = new Logger(types, this)
        this.logger.log("构造函数被调用")
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

    public newPromise(
        callback: (
            resolve: (value: unknown) => void,
            reject: (reason: unknown) => void
        ) => void
    ): Promise<unknown> {
        return new Promise(callback)
    }

    public getTestProperty(this: this): string {
        this.logger.log(`获取 测试属性 为 ${JSON.stringify(this.testProperty)}`)
        return this.testProperty
    }

    public setTestProperty(this: this, value: string): void {
        this.logger.log(`设置 测试属性 为 ${JSON.stringify(value)}`)
        this.testProperty = value
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
