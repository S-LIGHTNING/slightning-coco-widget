import { addThisForMethods, Color, exportWidget, getSuperWidget, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_METHOD_GROUP_WIDGET",
    info: { title: "方法分组", icon: "icon-widget-list-viewer" },
    options: { visible: false, global: true },
    properties: [],
    methods: [
        {
            label: "组1",
            blockOptions: {
                color: Color.PINK
            },
            contents: [
                {
                    key: "method1",
                    label: "方法1",
                    block: [MethodBlockParam.METHOD]
                }, {
                    key: "method2",
                    label: "方法2",
                    block: [MethodBlockParam.METHOD]
                }
            ]
        }, {
            label: "组2",
            blockOptions: {
                color: Color.PURPLE
            },
            contents: [
                {
                    key: "method3",
                    label: "方法3",
                    block: [MethodBlockParam.METHOD]
                }
            ]
        }
    ],
    events: []
}

class MethodGroupWidget extends getSuperWidget(types) {
    method1(): void {}
    method2(): void {}
    method3(): void {}
}

exportWidget(types, MethodGroupWidget, {
    decorators: [
        addThisForMethods,
        { CreationProject: transformIcons }
    ]
})
