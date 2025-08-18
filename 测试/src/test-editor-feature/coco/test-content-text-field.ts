import { CoCo } from "slightning-coco-widget"

const types: CoCo.Types = {
    type: "SLIGHTNING_COCO_WIDGET_TEST_CONTENT_TEXT_FIELD_WIDGET",
    title: "测试 contentTextField",
    contentTextField: "content",
    icon: "https://s-lightning.github.io/slightning-coco-widget/img/logo.png",
    isInvisibleWidget: true,
    isGlobalWidget: true,
    properties: [
        {
            key: "content",
            label: "内容",
            valueType: "string",
            defaultValue: "内容"
        }
    ],
    methods: [],
    events: []
}

class Widget extends CoCo.VisibleWidget {}

CoCo.exportWidget(types, Widget)
