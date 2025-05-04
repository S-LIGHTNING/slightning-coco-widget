import React from "react"
import { addCheck, addThisForMethods, Color, exportWidget, generateBlockForProperties, getSuperWidget, IntegerType, Logger, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_TEST_CONSTRUCT_ERROR_WIDGET",
    info: {
        title: "测试构造错误",
        icon: "icon-widget-radio",
        category: "SLIGHTNING CoCo 控件框架 测试",
    },
    options: {
        visible: true,
        global: false
    },
    properties: [
        {
            key: "__width",
            label: "宽度",
            type: new IntegerType({
                defaultValue: 300
            })
        }, {
            key: "__height",
            label: "高度",
            type: new IntegerType({
                defaultValue: 300
            })
        }
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
                    block: [MethodBlockParam.METHOD]
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
        generateBlockForProperties
    ],
    CoCo: {
        decorators: [
            addThisForMethods,
            addCheck
        ]
    },
    CreationProject: {
        decorators: [
            addThisForMethods,
            addCheck,
            transformIcons
        ]
    }
})
