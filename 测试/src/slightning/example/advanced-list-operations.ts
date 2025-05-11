import { addCheck, addThisForMethods, AnyType, ArrayType, BooleanType, Color, exportWidget, FunctionType, getSuperWidget, NumberType, transformIcons, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_ADVANCED_LIST_OPERATIONS_WIDGET",
    info: {
        title: "高级列表操作",
        category: "工具",
        icon: "icon-widget-list-viewer"
    },
    options: {
        visible: false,
        global: true
    },
    properties: [],
    methods: [{
        blockOptions: {
            color: Color.YELLOW
        },
        contents: [
            {
                key: "arrayMap",
                label: "列表映射",
                block: [
                    "映射", {
                        key: "array",
                        label: "列表",
                        type: new ArrayType({
                            defaultValue: ["列表"]
                        })
                    }, {
                        key: "callback",
                        label: "回调函数",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "item",
                                    label: "项",
                                    type: new AnyType()
                                }, {
                                    key: "index",
                                    label: "索引",
                                    type: new NumberType()
                                }, {
                                    key: "array",
                                    label: "列表",
                                    type: new ArrayType()
                                }
                            ],
                            returns: new AnyType()
                        })
                    }
                ],
                returns: new ArrayType(),
                tooltip: "返回给定列表中每个元素经过回调函数映射后的新列表。"
            }, {
                key: "arrayFilter",
                label: "列表过滤",
                block: [
                    "过滤", {
                        key: "array",
                        label: "列表",
                        type: new ArrayType({
                            defaultValue: ["列表"]
                        })
                    }, {
                        key: "callback",
                        label: "回调函数",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "item",
                                    label: "项",
                                    type: new AnyType()
                                }, {
                                    key: "index",
                                    label: "索引",
                                    type: new NumberType()
                                }, {
                                    key: "array",
                                    label: "列表",
                                    type: new ArrayType()
                                }
                            ],
                            returns: new BooleanType({
                                defaultValue: true
                            })
                        })
                    }
                ],
                returns: new ArrayType(),
                tooltip: "返回给定列表中满足回调函数条件的元素组成的新列表。"
            }, {
                key: "arrayEvery",
                label: "列表全部满足",
                block: [
                    {
                        key: "array",
                        label: "列表",
                        type: new ArrayType({
                            defaultValue: ["列表"]
                        })
                    }, "全部满足", {
                        key: "callback",
                        label: "回调函数",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "item",
                                    label: "项",
                                    type: new AnyType()
                                }, {
                                    key: "index",
                                    label: "索引",
                                    type: new NumberType()
                                }, {
                                    key: "array",
                                    label: "列表",
                                    type: new ArrayType()
                                }
                            ],
                            returns: new BooleanType({
                                defaultValue: true
                            })
                        })
                    }
                ],
                returns: new BooleanType(),
                tooltip: "判断给定列表中是否全部元素都满足回调函数的条件。"
            }, {
                key: "arraySome",
                label: "列表存在满足",
                block: [
                    {
                        key: "array",
                        label: "列表",
                        type: new ArrayType({
                            defaultValue: ["列表"]
                        })
                    }, "存在满足", {
                        key: "callback",
                        label: "回调函数",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "item",
                                    label: "项",
                                    type: new AnyType()
                                }, {
                                    key: "index",
                                    label: "索引",
                                    type: new NumberType()
                                }, {
                                    key: "array",
                                    label: "列表",
                                    type: new ArrayType()
                                }
                            ],
                            returns: new BooleanType({
                                defaultValue: true
                            })
                        })
                    }
                ],
                returns: new BooleanType(),
                tooltip: "判断给定列表中是否存在至少一个元素满足回调函数的条件。"
            }
        ]}
    ],
    events: []
}

class AdvancedListOperationsWidget extends getSuperWidget(types) {

    public constructor(props: object) {
        super(props)
    }

    public arrayMap(
        array: unknown[],
        callback: (value: unknown, index: number, array: unknown[]) => unknown | Promise<unknown>
    ): Promise<unknown[]> {
        const result: Promise<unknown>[] = []
        for (let i: number = 0; i < array.length; i++) {
            if (i in array) {
                result[i] = Promise.resolve(callback(array[i], i, array))
            }
        }
        return Promise.all(result)
    }

    public async arrayFilter(
        array: unknown[],
        callback: (value: unknown, index: number, array: unknown[]) => boolean | Promise<boolean>
    ): Promise<unknown[]> {
        const result: unknown[] = []
        const promises: Promise<boolean>[] = []
        for (let i: number = 0; i < array.length; i++) {
            if (i in array) {
                promises.push(Promise.resolve(callback(array[i], i, array)))
            }
        }
        for (let i: number = 0; i < array.length; i++) {
            if (i in array && await promises[i]) {
                result.push(array[i])
            }
        }
        return result
    }

    public arrayEvery(
        array: unknown[],
        callback: (value: unknown, index: number, array: unknown[]) => boolean | Promise<boolean>
    ): boolean | Promise<boolean> {
        const promises: Promise<boolean>[] = []
        for (let i: number = 0; i < array.length; i++) {
            if (i in array) {
                const result: boolean | Promise<boolean> = callback(array[i], i, array)
                if (result instanceof Promise) {
                    promises.push(result)
                } else if (!result) {
                    return false
                }
            }
        }
        if (promises.length == 0) {
            return true
        }
        return new Promise((
            resolve: (value: boolean) => void
        ): void => {
            Promise.all(promises.map(async (promise: Promise<boolean>): Promise<boolean> => {
                const value: boolean = await promise
                if (!value) {
                    resolve(false)
                }
                return value
            })).then((): void => {
                resolve(true)
            })
        })
    }

    public arraySome(
        array: unknown[],
        callback: (value: unknown, index: number, array: unknown[]) => boolean | Promise<boolean>
    ): boolean | Promise<boolean> {
        const promises: Promise<boolean>[] = []
        for (let i: number = 0; i < array.length; i++) {
            if (i in array) {
                const result: boolean | Promise<boolean> = callback(array[i], i, array)
                if (result instanceof Promise) {
                    promises.push(result)
                } else if (result) {
                    return true
                }
            }
        }
        if (promises.length == 0) {
            return false
        }
        return new Promise((
            resolve: (value: boolean) => void
        ): void => {
            Promise.all(promises.map(async (promise: Promise<boolean>): Promise<boolean> => {
                const value: boolean = await promise
                if (value) {
                    resolve(true)
                }
                return value
            })).then((): void => {
                resolve(false)
            })
        })
    }
}

exportWidget(types, AdvancedListOperationsWidget, {
    CoCo: {
        decorators: [
            transformMethodsCallbackFunctionsToEvents,
            addThisForMethods,
            addCheck
        ]
    },
    CreationProject: {
        decorators: [
            transformMethodsCallbackFunctionsToCodeBlocks,
            addThisForMethods,
            addCheck,
            transformIcons
        ]
    }
})
