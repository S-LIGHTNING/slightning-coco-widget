import React from "react"
import { addCheck, addThisForMethods, Color, exportWidget, generateBlockForProperties, getSuperWidget, Logger, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_TEST_CONSTRUCT_ERROR_WIDGET",
    info: {
        title: "测试构造错误",
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
        visible: true,
        global: false
    },
    properties: [
        ["__width", "宽度", 300],
        ["__height", "高度", 300]
    ],
    methods: [
        {
            blockOptions: {
                color: Color.RED
            },
            contents: [
                {
                    key: "method",
                    label: "方法",
                    block: [MethodBlockParam.THIS, MethodBlockParam.METHOD]
                }
            ]
        }
    ],
    events: []
}

class TestConstructErrorWidget extends getSuperWidget(types) {

    private logger: Logger

    constructor(props: object) {
        super(props)
        this.logger = new Logger(types, this)
        throw new Error("控件构造函数抛出异常")
    }

    public deprecated_method(): void {}

    public render(this: this): React.ReactNode {
        return React.createElement("div")
    }

    public method(this: this): void {
        this.logger.log("方法被调用")
    }
}

exportWidget(types, TestConstructErrorWidget, {
    decorators: [
        { "CoCo|CreationProject": [
            generateBlockForProperties,
            addThisForMethods,
        ]},
        addCheck,
        { CreationProject: transformIcons }
    ]
})
