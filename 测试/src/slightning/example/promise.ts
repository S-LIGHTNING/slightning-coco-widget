import { addCheck, addThisForMethods, AnyType, Color, exportWidget, FunctionType, generateMethodForFunctions, getSuperWidget, InstanceType, MethodBlockParam, MethodParamTypes, ObjectType, transformIcons, transformIconsExceptWidgetIcon, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types } from "slightning-coco-widget"

const PromiseType = new ObjectType<{
    promise: Promise<unknown>
}>({
    propertiesType: {
        promise: new InstanceType(Promise)
    },
    defaultValue: "承诺"
})

const MethodPromiseParam: MethodParamTypes = ["promise", "承诺", PromiseType]
const MethodPromiseValueParam: MethodParamTypes = ["value", "结果", new AnyType("结果")]
const MethodPromiseReasonParam: MethodParamTypes = ["reason", "原因", new AnyType("原因")]

const types: Types = {
    type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_PROMISE_WIDGET",
    info: {
        title: "承诺",
        icon: "https://s-lightning.github.io/slightning-coco-widget/img/logo.png",
        category: "控制",
        version: "2.8.0",
        author: "SLIGHTNING",
        url: {
            homepage: "https://s-lightning.github.io/slightning-coco-widget/",
            docs: "http://localhost:3000/slightning-coco-widget/docs/example/promise#使用控件",
            repository: "https://gitee.com/slightning/slightning-coco-widget",
            bugReport: "https://gitee.com/slightning/slightning-coco-widget/issues/new",
        }
    },
    options: {
        visible: false,
        global: true
    },
    properties: [],
    methods: [{ blockOptions: {
        color: Color.CYAN
    }, contents: [
        ["newPromise", "创建承诺", [
            MethodBlockParam.METHOD,
            ["callback", "回调", new FunctionType({ block: [
                ["resolve", "解决", new FunctionType({ block: ["结果", MethodPromiseReasonParam] })],
                ["reject", "拒绝", new FunctionType({ block: ["原因", MethodPromiseReasonParam] })]
            ]})]
        ], PromiseType],
        ["await", "等待", [MethodBlockParam.METHOD, MethodPromiseParam]],
        ["then", "然后", [
            MethodPromiseParam, MethodBlockParam.METHOD,
            ["callback", "回调", new FunctionType({ block: [MethodPromiseValueParam] })]
        ]],
        ["catch", "捕获", [
            MethodPromiseParam, MethodBlockParam.METHOD,
            ["callback", "回调", new FunctionType({ block: [MethodPromiseReasonParam] }) ]
        ]]
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
        { "CoCo|CreationProject": generateMethodForFunctions},
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        },
        { "CoCo|CreationProject": addThisForMethods },
        addCheck,
        {
            CoCo: transformIconsExceptWidgetIcon,
            CreationProject: transformIcons
        }
    ]
})
