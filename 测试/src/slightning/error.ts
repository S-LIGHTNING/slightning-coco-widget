import { addCheck, addThisForMethods, AnyType, Color, exportWidget, generateBlockForProperties, getSuperWidget, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

import packageInfo from "../../package.json"

const types: Types = {
    type: "SLIGHTNING_TEST_ERROR_WIDGET",
    info: {
        title: "测试错误",
        icon: "https://s-lightning.github.io/slightning-coco-widget/img/logo.png",
        category: "测试 SCW",
        version: packageInfo.version,
        author: packageInfo.author,
        url: {
            homepage: "https://s-lightning.github.io/slightning-coco-widget/",
            docs: "https://s-lightning.github.io/slightning-coco-widget/",
            repository: "https://gitee.com/slightning/slightning-coco-widget",
            bugReport: "https://gitee.com/slightning/slightning-coco-widget/issues/new",
        }
    },
    options: {
        visible: true,
        global: false
    },
    properties: [
        ["__width", "宽度", 300],
        ["__height", "高度", 300]
    ],
    methods: [{ blockOptions: {
        color: Color.RED
    }, contents: [
        {
            label: "弃用的一组方法",
            contents: [
                ["deprecated_method", "弃用的方法", [MethodBlockParam.METHOD],, {
                    deprecated: true
                }]
            ]
        }, { label: "出错测试", contents: [
            ["nonExistentMethod", "不存在的方法", [MethodBlockParam.METHOD]],
            ["throwError", "抛出异常", [
                MethodBlockParam.METHOD,
                ["message", "消息", new AnyType("抛出异常消息")]
            ]],
            ["asyncThrowError", "异步抛出异常", [
                MethodBlockParam.METHOD,
                ["message", "消息", new AnyType("异步抛出异常消息")]
            ]]
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
        { "CoCo|CreationProject": [
            generateBlockForProperties,
            addThisForMethods,
        ]},
        addCheck,
        { CreationProject: transformIcons }
    ]
})
