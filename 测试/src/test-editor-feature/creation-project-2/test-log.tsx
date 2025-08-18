import { CreationProject2 } from "slightning-coco-widget"
import _ from "lodash"
import React from "react"

const type: CreationProject2.Types = {
    type: "SLIGHTNING_COCO_WIDGET_TEST_CREATION_PROJECT_2_LOG_WIDGET",
    label: "测试日志",
    icon: "https://s-lightning.github.io/slightning-coco-widget/img/logo.png",
    category: "SCW 测试编辑器特性",
    visibleWidget: true,
    global: false,
    props: [],
    methods: [
        {
            key: "log",
            label: "输出",
            params: [
                {
                    key: "type",
                    valueType: "dropdown",
                    dropdown: [["日志", "log"], ["信息", "info"], ["警告", "warn"], ["错误", "error"]]
                }, {
                    key: "message",
                    valueType: "any",
                    defaultValue: "消息"
                }
            ]
        }
    ],
    emits: []
}

class widget extends CreationProject2.widgetClass {

    public constructor() {
        super()
        this.widgetLog("在构造函数中输出的日志")
    }

    public log(
        this: this,
        type: "log" | "info" | "warn" | "error",
        message: unknown
    ): void {
        this[`widget${_.capitalize(type)}`](message)
    }

    public override render(): JSX.Element {
        this.widgetInfo("在渲染函数中输出的日志")
        return <div>测试日志</div>
    }
}

CreationProject2.exportWidget(type, widget)
