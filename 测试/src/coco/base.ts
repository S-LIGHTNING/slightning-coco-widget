import { CoCo } from "slightning-coco-widget"

const types: CoCo.Types = {
    type: "SLIGHTNING_TEST_WIDGET",
    title: "测试",
    icon: "icon-widget-radio",
    isInvisibleWidget: true,
    isGlobalWidget: false,
    properties: [],
    methods: [],
    events: []
}

class TestWidget extends CoCo.InvisibleWidget {}

CoCo.exportWidget(types, TestWidget)
