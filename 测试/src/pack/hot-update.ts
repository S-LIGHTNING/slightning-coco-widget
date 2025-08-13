import { addCheck, addThisForMethods, Color, exportWidget, getSuperWidget, Logger, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

import packageInfo from "../../package.json"

const types: Types = {
    type: "SLIGHTNING_TEST_HOT_UPDATE_WIDGET",
    info: {
        title: "测试热更新",
        icon: "icon-widget-radio",
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
        visible: false,
        global: false
    },
    properties: [],
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
