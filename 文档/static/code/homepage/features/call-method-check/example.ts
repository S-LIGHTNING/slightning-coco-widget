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
        /**
         * 在控件方法中产生的异常可以被 SCW 捕获并输出。
         *
         * 利用这一特性，可以通过抛出异常的方式轻松实现出错中断。
         */
        throw new Error("出错啦出错啦！")
    }
}

exportWidget(types, ThrowErrorWidget, {
    decorators: [
        addThisForMethods,
        /** 添加检查功能。 */
        addCheck,
        { CreationProject: transformIcons }
    ]
})
