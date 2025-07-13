import { addCheck, addThisForMethods, Color, exportWidget, getSuperWidget, MethodBlockParam, transformIcons, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_THROW_ERROR_WIDGET",
    info: { title: "抛出异常", icon: "icon-widget-list-viewer" },
    options: { visible: false, global: true },
    properties: [],
    methods: [{
        key: "throwError",
        label: "抛出异常",
        block: [MethodBlockParam.METHOD],
        blockOptions: { color: Color.RED }
    }],
    events: []
}

class ThrowErrorWidget extends getSuperWidget(types) {
    throwError(): void {
        /** 看 CoCo 再吞个试试。 */
        throw new Error("出错啦出错啦！")
    }
}

exportWidget(types, ThrowErrorWidget, {
    decorators: [
        addThisForMethods,
        addCheck,
        { CreationProject: transformIcons }
    ]
})
