import { addCheck, addThisForMethods, AnyType, ArrayType, BooleanType, Color, exportWidget, FunctionType, getSuperWidget, IntegerType, transformIcons, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_ARRAY_FILTER_WIDGET",
    info: { title: "列表过滤", icon: "icon-widget-list-viewer" },
    options: { visible: false, global: true },
    properties: [],
    methods: [{
        key: "arrayFilter",
        label: "列表过滤",
        block: [
            "按", {
                key: "condition",
                label: "条件",
                /** 懂不懂 FunctionType 的含金量？ */
                type: new FunctionType({
                    block: [
                        {
                            key: "item",
                            label: "项",
                            type: new AnyType()
                        }, {
                            key: "index",
                            label: "索引",
                            type: new IntegerType()
                        }, {
                            key: "array",
                            label: "列表",
                            type: new ArrayType()
                        }
                    ],
                    returns: new BooleanType(true)
                })
            }, "过滤", {
                key: "array",
                label: "列表",
                type: new ArrayType({
                    itemType: new AnyType(),
                    defaultValue: ["列表"]
                })
            }
        ],
        returns: new ArrayType(),
        blockOptions: { color: Color.YELLOW }
    }],
    events: []
}

class ArrayFilterWidget extends getSuperWidget(types) {
    async arrayFilter(
        /** 在控件实体中直接就是函数类型，不需要任何额外的转换，用真是太爽啦！ */
        condition: (item: unknown, index: number, array: unknown[]) => boolean | Promise<boolean>,
        array: unknown[]
    ): Promise<unknown[]> {
        const conditionResultArray: (boolean | Promise<boolean>)[] = []
        for (const i in array) {
            conditionResultArray[i] = condition(array[i], Number(i) + 1, array)
        }
        const result: unknown[] = []
        for (const i in array) {
            const conditionResult: boolean | undefined = await conditionResultArray[i]
            if (conditionResult) {
                result.push(array[i])
            }
        }
        return result
    }
}

exportWidget(types, ArrayFilterWidget, {
    decorators: [
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        },
        addThisForMethods,
        addCheck,
        { CreationProject: transformIcons }
    ]
})
