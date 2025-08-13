import { addThisForMethods, Color, exportWidget, getSuperWidget, MethodBlockParam, MethodTypes, Types } from "slightning-coco-widget"

import packageInfo from "../../package.json"

const types: Types = {
    type: "SLIGHTNING_TEST_COLOR_WIDGET",
    info: {
        title: "测试颜色",
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
        visible: false,
        global: false
    },
    properties: [],
    methods: [
        ...Object.entries(Color).map(([name, color]: [string, Color]): MethodTypes => ({
            key: name,
            label: name,
            block: [MethodBlockParam.METHOD],
            blockOptions: { color }
        }))
    ],
    events: []
}

class TestColorWidget extends getSuperWidget(types) {
    constructor(props: object) {
        super(props)
    }
}

exportWidget(types, TestColorWidget, {
    decorators: [
        { "CoCo|CreationProject": addThisForMethods }
    ]
})
