import { CreationProject2 } from "slightning-coco-widget"

const type: CreationProject2.Types = {
    type: "SLIGHTNING_COCO_WIDGET_TEST_CREATION_PROJECT_2_NO_PREVIOUS_STATEMENT_METHOD_WIDGET",
    label: "测试无前积木方法",
    icon: "https://s-lightning.github.io/slightning-coco-widget/img/logo.png",
    category: "SCW 测试编辑器特性",
    visibleWidget: false,
    global: false,
    props: [],
    methods: [
        {
            key: "method0",
            label: "方法0",
            params: [],
            blockOptions: {
                previousStatement: false
            }
        }
    ],
    emits: []
}

class widget extends CreationProject2.widgetClass {
    public method0(this: this): void {
        this.widgetLog("方法被调用")
    }
}

CreationProject2.exportWidget(type, widget)
