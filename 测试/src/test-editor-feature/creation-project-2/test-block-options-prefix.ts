import { CreationProject2 } from "slightning-coco-widget"

const type: CreationProject2.Types = {
    type: "SLIGHTNING_COCO_WIDGET_TEST_CREATION_PROJECT_2_BLOCK_OPTIONS_PREFIX_WIDGET",
    label: "测试积木选项 prefix",
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
                prefix: ""
            }
        }, {
            key: "method1",
            label: "方法1",
            params: [],
            blockOptions: {
                prefix: "我就是要调用"
            }
        }
    ],
    emits: []
}

class widget extends CreationProject2.widgetClass {
    public method0(this: this): void {}
    public method1(this: this): void {}
}

CreationProject2.exportWidget(type, widget)
