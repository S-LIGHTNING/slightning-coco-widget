---
sidebar_position: 2
---

# 封装 JS 承诺（Promise）

## 介绍

JS 承诺 API 中大量使用了函数作为参数，尤其是创建承诺方法，不仅需要传入回调函数，回调函数中还需要传入 `resolve` 和 `reject` 方法。

如此复杂的函数参数，不使用框架或使用其他框架难以实现对承诺的封装，就算能封装，为了支持 Creation Project 回调特性，还要额外写一份针对 Creation Project 的代码。

而 SCW 提供了强大的函数参数功能，使得对承诺的封装变得非常简单且易于使用，无需额外编写针对 Creation Project 的代码。写起来也很简单，只需对着 JS 承诺 API 抄就行了，基本上不用动脑子。

## 控件代码

```typescript
import { addCheck, addThisForMethods, AnyType, Color, exportWidget, FunctionType, generateMethodForFunctions, getSuperWidget, InstanceType, MethodBlockParam, MethodParamTypes, ObjectType, transformIcons, transformIconsExceptWidgetIcon, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types } from "slightning-coco-widget"

const PromiseType = new ObjectType<{
    promise: Promise<unknown>
}>({
    propertiesType: {
        promise: new InstanceType(Promise)
    },
    defaultValue: "承诺"
})

const MethodPromiseParam: MethodParamTypes = ["promise", "承诺", PromiseType]
const MethodPromiseValueParam: MethodParamTypes = ["value", "结果", new AnyType("结果")]
const MethodPromiseReasonParam: MethodParamTypes = ["reason", "原因", new AnyType("原因")]

const types: Types = {
    type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_PROMISE_WIDGET",
    info: {
        title: "承诺",
        icon: "icon-widget-switch",
        category: "控制",
        version: "2.5.0",
        url: {
            homepage: "https://s-lightning.github.io/slightning-coco-widget/",
            docs: "http://localhost:3000/slightning-coco-widget/docs/example/promise#使用控件",
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
        color: Color.CYAN
    }, contents: [
        ["newPromise", "创建承诺", [
            MethodBlockParam.METHOD,
            ["callback", "回调", new FunctionType({ block: [
                ["resolve", "解决", new FunctionType({ block: ["结果", MethodPromiseReasonParam] })],
                ["reject", "拒绝", new FunctionType({ block: ["原因", MethodPromiseReasonParam] })]
            ]})]
        ], PromiseType],
        ["await", "等待", [MethodBlockParam.METHOD, MethodPromiseParam]],
        ["then", "然后", [
            MethodPromiseParam, MethodBlockParam.METHOD,
            ["callback", "回调", new FunctionType({ block: [MethodPromiseValueParam] })]
        ]],
        ["catch", "捕获", [
            MethodPromiseParam, MethodBlockParam.METHOD,
            ["callback", "回调", new FunctionType({ block: [MethodPromiseReasonParam] }) ]
        ]]
    ]}],
    events: []
}

class TestBaseWidget extends getSuperWidget(types) {

    public constructor(props: unknown) {
        super(props)
    }

    public newPromise(
        callback: (
            resolve: (value: unknown) => void,
            reject: (reason: unknown) => void
        ) => void
    ): { promise: Promise<unknown> } {
        return { promise: new Promise(callback) }
    }

    public await(promise: { promise: Promise<unknown> }): Promise<unknown> {
        return promise.promise
    }

    public then(
        promise: { promise: Promise<unknown> },
        callback: (value: unknown) => void
    ): Promise<unknown> {
        return promise.promise.then(callback)
    }

    public catch(
        promise: { promise: Promise<unknown> },
        callback: (reason: unknown) => void
    ): Promise<unknown> {
        return promise.promise.catch(callback)
    }
}

exportWidget(types, TestBaseWidget, {
    decorators: [
        { "CoCo|CreationProject": generateMethodForFunctions},
        {
            CoCo: transformMethodsCallbackFunctionsToEvents,
            CreationProject: transformMethodsCallbackFunctionsToCodeBlocks
        },
        { "CoCo|CreationProject": addThisForMethods },
        addCheck,
        {
            CoCo: transformIconsExceptWidgetIcon,
            CreationProject: transformIcons
        }
    ]
})
```

## 生成的积木

:::info 信息
不同版本的 SCW 生成的积木顺序和样式略有差异，但它们的功能都是一样的。
:::

### CoCo

![CoCo 生成的积木.png](https://s2.loli.net/2025/05/04/C6q1AyiKFcJQwrN.jpg)

### Creation Project

![Creation Project 生成的积木.png](https://s2.loli.net/2025/05/04/WfqGQABScM42Ed9.jpg)
