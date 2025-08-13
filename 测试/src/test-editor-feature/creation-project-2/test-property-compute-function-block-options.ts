import { CreationProject2 } from "slightning-coco-widget"

const type: CreationProject2.Types = {
    type: "SLIGHTNING_COCO_WIDGET_TEST_CREATION_PROJECT_2_PROPERTY_COMPUTE_FUNCTION_BLOCK_OPTIONS_WIDGET",
    label: "测试属性计算函数",
    icon: "https://s-lightning.github.io/slightning-coco-widget/img/logo.png",
    category: "SCW 测试编辑器特性",
    visibleWidget: false,
    global: false,
    props: [
        {
            key: "property0",
            label: "属性0",
            valueType: "string",
            defaultValue: "默认值",
            blockOptions: {
                setter: {
                    generateBlock: false
                }
            }
        }
    ],
    methods: [],
    emits: []
}

class widget extends CreationProject2.widgetClass {}

CreationProject2.exportWidget(type, widget)
