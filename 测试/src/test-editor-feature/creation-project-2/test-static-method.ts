import { CreationProject2 } from "slightning-coco-widget"

const type: CreationProject2.Types = {
    type: "SLIGHTNING_COCO_WIDGET_TEST_CREATION_PROJECT_2_STATIC_METHOD_WIDGET",
    label: "测试静态方法",
    icon: "https://s-lightning.github.io/slightning-coco-widget/img/logo.png",
    visibleWidget: false,
    global: false,
    props: [],
    methods: [
        {
            static: true,
            key: "staticMethod",
            label: "静态方法",
            params: []
        }
    ],
    emits: []
}

class widget extends CreationProject2.widgetClass {

    public static staticMethod(): void {
        console.log("静态方法被调用")
    }

    public staticMethod(): void {
        console.log("实例中的静态方法被调用")
    }
}

CreationProject2.exportWidget(type, widget)
