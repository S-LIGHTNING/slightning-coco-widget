import type { CoCo } from "slightning-coco-widget"

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

declare const InvisibleWidget: typeof CoCo.InvisibleWidget

class TestBlockColorWidget extends InvisibleWidget {}

exports.types = types
exports.widget = TestBlockColorWidget
