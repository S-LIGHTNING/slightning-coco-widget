import { addCheck, addThisForMethods, AnyType, Color, exportWidget, FunctionType, generateMethodForFunctions, getSuperWidget, InstanceType, MethodBlockParam, MethodParamTypes, ObjectType, transformIcons, transformIconsExceptWidgetIcon, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types } from "slightning-coco-widget"

const PromiseType = new ObjectType<{
    promise: Promise<unknown>
}>({
    propertiesType: {
        promise: new InstanceType(Promise)
    },
    defaultValue: "承诺"
})

const MethodPromiseParam: MethodParamTypes = {
    key: "promise",
    label: "承诺",
    type: PromiseType
}

const MethodPromiseValueParam: MethodParamTypes = {
    key: "value",
    label: "结果",
    type: new AnyType("结果")
}

const MethodPromiseReasonParam: MethodParamTypes = {
    key: "reason",
    label: "原因",
    type: new AnyType("原因")
}

const types: Types = {
    type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_PROMISE_WIDGET",
    info: {
        title: "承诺",
        icon: "icon-widget-switch",
        category: "控制",
    },
    options: {
        visible: false,
        global: true
    },
    properties: [],
    methods: [{ blockOptions: {
        color: Color.CYAN
    }, contents: [
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
                                    block: ["结果", MethodPromiseValueParam]
                                })
                            }, {
                                key: "reject",
                                label: "拒绝",
                                type: new FunctionType({
                                    block: ["原因", MethodPromiseReasonParam]
                                })
                            }
                        ]
                    })
                }
            ],
            returns: PromiseType
        }, {
            key: "await",
            label: "等待",
            block: [MethodBlockParam.METHOD, MethodPromiseParam]
        }, {
            key: "then",
            label: "然后",
            block: [
                MethodPromiseParam, MethodBlockParam.METHOD, {
                    key: "callback",
                    label: "回调",
                    type: new FunctionType({
                        block: [MethodPromiseValueParam]
                    })
                }
            ]
        }, {
            key: "catch",
            label: "捕获",
            block: [
                MethodPromiseParam, MethodBlockParam.METHOD, {
                    key: "callback",
                    label: "回调",
                    type: new FunctionType({
                        block: [MethodPromiseReasonParam]
                    })
                }
            ]
        }
    ]}],
    events: []
}

class TestBaseWidget extends getSuperWidget(types) {

    public constructor(props: unknown) {
        super(props)
    }

    public newPromise(
        callback: (
            resolve: (value: unknown) => void,
            reject: (reason: unknown) => void
        ) => void
    ): { promise: Promise<unknown> } {
        return { promise: new Promise(callback) }
    }

    public await(promise: { promise: Promise<unknown> }): Promise<unknown> {
        return promise.promise
    }

    public then(
        promise: { promise: Promise<unknown> },
        callback: (value: unknown) => void
    ): Promise<unknown> {
        return promise.promise.then(callback)
    }

    public catch(
        promise: { promise: Promise<unknown> },
        callback: (reason: unknown) => void
    ): Promise<unknown> {
        return promise.promise.catch(callback)
    }
}

exportWidget(types, TestBaseWidget, {
    decorators: [
        generateMethodForFunctions,
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        },
        addThisForMethods,
        addCheck,
        {
            CoCo: transformIconsExceptWidgetIcon,
            CreationProject: transformIcons
        }
    ]
})
