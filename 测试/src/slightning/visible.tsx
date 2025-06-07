import React from "react"
import { Types, NumberType, getSuperWidget, exportWidget, addCheck, addThisForMethods, generateBlockForProperties, transformIcons, transformIconsExceptWidgetIcon, Color, MethodBlockParam } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_TEST_VISIBLE_WIDGET",
    info: {
        title: "测试可见控件",
        icon: "icon-widget-radio",
        category: "测试 SCW",
    },
    options: {
        visible: true,
        global: false
    },
    properties: [
        {
            key: "__width",
            label: "宽度",
            type: new NumberType(360)
        }, {
            key: "__height",
            label: "高度",
            type: new NumberType(360)
        }, {
            key: "count",
            label: "计数",
            type: new NumberType(0)
        }
    ],
    methods: [{ blockOptions: {
        color: Color.PINK
    }, contents: [
        {
            key: "increaseCount",
            label: "增加计数",
            block: [MethodBlockParam.METHOD]
        }
    ]}],
    events: []
}

class TestVisibleWidget extends getSuperWidget(types) {

    public count!: number

    public constructor(props: unknown) {
        super(props)
    }

    public increaseCount(this: this): void {
        setInterval((): void => {
            this.count++
        }, 100)
    }

    public render(this: this): JSX.Element {
        return <div>{this.count}</div>
    }
}

exportWidget(types, TestVisibleWidget, {
    decorators: [
        generateBlockForProperties,
        addThisForMethods,
        addCheck,
        {
            CoCo: transformIconsExceptWidgetIcon,
            CreationProject: transformIcons
        }
    ]
})
