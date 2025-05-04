import { addCheck, addThisForMethods, Color, exportWidget, getSuperWidget, IntegerType, Logger, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_TEST_HOT_UPDATE_WIDGET",
    info: {
        title: "测试热更新",
        icon: "icon-widget-radio",
        category: "SLIGHTNING CoCo 控件框架 测试",
    },
    options: {
        visible: false,
        global: false
    },
    properties: [
        {
            key: "__width",
            label: "宽度",
            type: new IntegerType({
                defaultValue: 360
            })
        }, {
            key: "__height",
            label: "高度",
            type: new IntegerType({
                defaultValue: 360
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
                    key: "printLog",
                    label: "打印日志",
                    block: [
                        MethodBlockParam.METHOD
                    ]
                }
            ]
        }
    ],
    events: []
}

class TestHotUpdateWidget extends getSuperWidget(types) {

    private readonly logger: Logger

    private count: number

    constructor(props: object) {
        super(props)
        this.logger = new Logger(types, this)
        this.count = 0
    }

    public printLog(): void {
        this.logger.log(`a, ${++this.count}`)
    }
}

exportWidget(types, TestHotUpdateWidget, {
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
