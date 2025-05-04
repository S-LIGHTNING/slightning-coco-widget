import { addThisForMethods, Color, exportWidget, getSuperWidget, MethodBlockParam, MethodTypes, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_TEST_COLOR_WIDGET",
    info: {
        title: "测试颜色",
        icon: "icon-widget-radio",
        category: "测试 SCW",
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
            block: [
                MethodBlockParam.METHOD
            ],
            blockOptions: {
                color
            }
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
    CoCo: {
        decorators: [
            addThisForMethods
        ]
    },
    CreationProject: {
        decorators: [
            addThisForMethods
        ]
    }
})
