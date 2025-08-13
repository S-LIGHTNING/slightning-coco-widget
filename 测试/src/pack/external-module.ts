import { addCheck, addThisForMethods, AnyType, Color, exportWidget, getSuperWidget, transformIcons, Types } from "slightning-coco-widget"

import packageInfo from "../../package.json"

const types: Types = {
    type: "SLIGHTNING_TEST_EXTERNAL_MODULE_WIDGET",
    info: {
        title: "测试外部模块",
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
    methods: [{ blockOptions: {
        color: Color.RED
    }, contents: [
        ["axios", "Axios", [
            ["method", "方法", [["GET", "GET"], ["POST", "POST"]]],
            ["url", "链接", "https://api.codemao.cn/creation-tools/v1/user/center/honor?user_id=6519713"]
        ], new AnyType()]
    ]}],
    events: []
}

class TestExternalModuleWidget extends getSuperWidget(types) {

    constructor(props: object) {
        super(props)
    }

    async axios(method: string, url: string): Promise<unknown> {
        return (await import("axios")).default({ method, url })
    }
}

exportWidget(types, TestExternalModuleWidget, {
    decorators: [
        { "CoCo|CreationProject": [
            addThisForMethods,
        ]},
        addCheck,
        { CreationProject: transformIcons }
    ]
})
