import React from "react"
import { Types, getSuperWidget, exportWidget, addCheck, generateBlockForProperties, transformIcons, transformIconsExceptWidgetIcon, Color, MethodBlockParam } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_TEST_VISIBLE_WIDGET",
    info: {
        title: "测试可见控件",
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
        ["__width", "宽度", 360],
        ["__height", "高度", 360],
        ["count", "计数", 0]
    ],
    methods: [{ blockOptions: {
        color: Color.PINK
    }, contents: [
        ["increaseCount", "增加计数", [MethodBlockParam.THIS, MethodBlockParam.METHOD]]
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
        { "CoCo|CreationProject": generateBlockForProperties },
        addCheck,
        {
            CoCo: transformIconsExceptWidgetIcon,
            CreationProject: transformIcons
        }
    ]
})
