---
sidebar_position: 2
---

# 封装 JS 高级列表操作

## 介绍

JS 中有一些复杂的列表操作，如：`map`、`filter`、`some`、`every` 等，这些操作需要接收一个回调函数对列表进行处理，并且需要获取回调函数的返回值。

像这样对回调函数的用法，不使用框架或使用其他框架实现起来非常麻烦，尤其是需要支持 Creation Project 的时候，必须要额外写一份针对 Creation Project 的代码。

而 SCW 提供了强大的函数参数功能，使得对列表操作的封装变得非常简单且易于使用，无需额外编写针对 Creation Project 的代码。

## 控件代码

```typescript
import { addCheck, addThisForMethods, AnyType, ArrayType, BooleanType, Color, exportWidget, FunctionType, getSuperWidget, MethodBlock, MethodParamTypes, NumberType, transformIcons, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types } from "slightning-coco-widget"

const MethodArrayParamTypes: MethodParamTypes = ["array", "列表", new ArrayType({ defaultValue: ["列表"] })]

const MethodCallbackParamBlock: MethodBlock = [
    ["item", "项", new AnyType()],
    ["index", "索引", new NumberType()],
    ["array", "列表", new ArrayType()]
]

const types: Types = {
    type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_ADVANCED_LIST_OPERATIONS_WIDGET",
    info: {
        title: "高级列表操作",
        icon: "icon-widget-list-viewer",
        category: "工具",
        version: "2.5.0",
        url: {
            homepage: "https://s-lightning.github.io/slightning-coco-widget/",
            docs: "http://localhost:3000/slightning-coco-widget/docs/example/advanced-list-operations#使用控件",
            repository: "https://gitee.com/slightning/slightning-coco-widget",
            bugReport: "https://gitee.com/slightning/slightning-coco-widget/issues/new",
        }
    },
    options: {
        visible: false,
        global: true
    },
    properties: [],
    methods: [{ blockOptions: {
        color: Color.YELLOW
    }, contents: [
        ["arrayMap", "列表映射", [
            "映射", MethodArrayParamTypes,
            ["callback", "回调函数", new FunctionType({
                block: MethodCallbackParamBlock,
                returns: new AnyType()
            })]
        ], new ArrayType(), {
            tooltip: "返回给定列表中每个元素经过回调函数映射后的新列表。"
        }],
        ["arrayFilter", "列表过滤", [
            "过滤", MethodArrayParamTypes,
            ["callback", "回调函数", new FunctionType({
                block: MethodCallbackParamBlock,
                returns: new BooleanType(true)
            })]
        ], new ArrayType(), {
            tooltip: "返回给定列表中满足回调函数条件的元素组成的新列表。"
        }],
        ["arrayEvery", "列表全部满足", [
            MethodArrayParamTypes, "全部满足",
            ["callback", "回调函数", new FunctionType({
                block: MethodCallbackParamBlock,
                returns: new BooleanType(true)
            })]
        ], new BooleanType(), {
            tooltip: "判断给定列表中是否全部元素都满足回调函数的条件。"
        }],
        ["arraySome", "列表存在满足", [
            MethodArrayParamTypes, "存在满足",
            ["callback", "回调函数", new FunctionType({
                block: MethodCallbackParamBlock,
                returns: new BooleanType(true)
            })]
        ], new BooleanType(), {
            tooltip: "判断给定列表中是否存在至少一个元素满足回调函数的条件。"
        }]
    ]}],
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
    decorators: [
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        }, {
            "CoCo|CreationProject": addThisForMethods
        },
        addCheck,
        { CreationProject: transformIcons }
    ]
})
```

## 生成的积木

:::info 信息
不同版本的 SCW 生成的积木顺序和样式略有差异，但它们的功能都是一样的。
:::

### CoCo

![CoCo 生成的积木.png](https://s2.loli.net/2025/05/11/gzxC6OiqocfAXDK.png)

### Creation Project

![Creation Project 生成的积木.png](https://s2.loli.net/2025/05/11/ZzUYRxNJIyecVtl.png)

## 使用控件

### CoCo

![CoCo 使用控件.png](https://s2.loli.net/2025/05/11/qYjQilkLaSuCthw.png)

### Creation Project

![Creation Project 使用控件.png](https://s2.loli.net/2025/05/11/6qO4bR2sx3nUchZ.jpg)
