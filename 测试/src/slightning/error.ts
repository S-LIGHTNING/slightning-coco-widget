import { addCheck, addThisForMethods, AnyType, Color, exportWidget, generateBlockForProperties, getSuperWidget, IntegerType, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_TEST_ERROR_WIDGET",
    info: {
        title: "测试错误",
        icon: "icon-widget-radio",
        category: "测试 SCW",
        version: "1.0.0",
        url: {
            homepage: "",
            docs: "",
            repository: "",
            bugReport: "",
        }
    },
    options: {
        visible: true,
        global: false
    },
    properties: [
        {
            key: "__width",
            label: "宽度",
            type: new IntegerType(300)
        }, {
            key: "__height",
            label: "高度",
            type: new IntegerType(300)
        }
    ],
    methods: [{ blockOptions: {
        color: Color.RED
    }, contents: [
        {
            label: "弃用的一组方法",
            contents: [
                {
                    key: "deprecated_method",
                    label: "弃用的方法",
                    block: [MethodBlockParam.METHOD],
                    deprecated: true
                }
            ]
        }, { label: "出错测试", contents: [
            {
                key: "nonExistentMethod",
                label: "不存在的方法",
                block: [MethodBlockParam.METHOD]
            }, {
                key: "throwError",
                label: "抛出异常",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "message",
                        label: "消息",
                        type: new AnyType("抛出异常消息")
                    }
                ]
            }, {
                key: "asyncThrowError",
                label: "异步抛出异常",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "message",
                        label: "消息",
                        type: new AnyType("异步抛出异常消息")
                    }
                ]
            }
        ]}
    ]}],
    events: []
}

class TestErrorWidget extends getSuperWidget(types) {

    constructor(props: object) {
        super(props)
    }

    public deprecated_method(): void {}

    public render(this: this): React.ReactNode {
        throw {
            null: null,
            undefined: undefined,
            string: "string",
            number: 0,
            boolean: true,
            Error: new Error("Error"),
            function: (): void => {},
            BigInt: BigInt(1e10),
            Symbol: Symbol("Symbol"),
            HTMLElement: document.createElement("div")
        }
    }

    public throwError(this: this, message: unknown): void {
        throw new Error(`${message}`)
    }

    public asyncThrowError(this: this, message: unknown): void {
        throw new Error(`${message}`)
    }
}

exportWidget(types, TestErrorWidget, {
    decorators: [
        generateBlockForProperties,
        addThisForMethods,
        addCheck,
        { CreationProject: transformIcons }
    ]
})
