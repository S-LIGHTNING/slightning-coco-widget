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
import { addCheck, addThisForMethods, AnyType, Color, exportWidget, FunctionType, generateMethodForFunctions, getSuperWidget, InstanceType, MethodBlockParam, ObjectType, transformIcons, transformIconsExceptWidgetIcon, transformMethodsCallbackFunctionsToCodeBlocks, transformMethodsCallbackFunctionsToEvents, Types } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_PROMISE_WIDGET",
    info: {
        title: "承诺",
        icon: "icon-widget-switch",
        category: "控制",
    },
    options: {
        visible: false,
        global: true
    },
    properties: [],
    methods: [{
        blockOptions: {
            color: Color.CYAN
        },
        contents: [
            {
                key: "newPromise",
                label: "创建承诺",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "callback",
                        label: "回调",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "resolve",
                                    label: "解决",
                                    type: new FunctionType({
                                        block: [
                                            "结果", {
                                                key: "value",
                                                label: "结果",
                                                type: new AnyType({
                                                    defaultValue: "结果"
                                                })
                                            }
                                        ]
                                    })
                                }, {
                                    key: "reject",
                                    label: "拒绝",
                                    type: new FunctionType({
                                        block: [
                                            "原因", {
                                                key: "reason",
                                                label: "原因",
                                                type: new AnyType({
                                                    defaultValue: "原因"
                                                })
                                            }
                                        ]
                                    })
                                }
                            ]
                        })
                    }
                ],
                returns: new ObjectType({
                    propertiesType: {
                        promise: new InstanceType({
                            theClass: Promise
                        })
                    }
                })
            }, {
                key: "await",
                label: "等待",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "promise",
                        label: "承诺",
                        type: new ObjectType<{
                            promise: Promise<unknown>
                        }>({
                            propertiesType: {
                                promise: new InstanceType({
                                    theClass: Promise
                                })
                            },
                            defaultValue: "承诺"
                        })
                    }
                ]
            }, {
                key: "awaitResult",
                label: "等待结果",
                block: [
                    MethodBlockParam.METHOD, {
                        key: "promise",
                        label: "承诺",
                        type: new ObjectType<{
                            promise: Promise<unknown>
                        }>({
                            propertiesType: {
                                promise: new InstanceType({
                                    theClass: Promise
                                })
                            },
                            defaultValue: "承诺"
                        })
                    }
                ],
                returns: new AnyType()
            }, {
                key: "then",
                label: "然后",
                block: [
                    {
                        key: "promise",
                        label: "承诺",
                        type: new ObjectType<{
                            promise: Promise<unknown>
                        }>({
                            propertiesType: {
                                promise: new InstanceType({
                                    theClass: Promise
                                })
                            },
                            defaultValue: "承诺"
                        })
                    }, MethodBlockParam.METHOD, {
                        key: "callback",
                        label: "回调",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "value",
                                    label: "结果",
                                    type: new AnyType()
                                }
                            ]
                        })
                    }
                ]
            }, {
                key: "catch",
                label: "捕获",
                block: [
                    {
                        key: "promise",
                        label: "承诺",
                        type: new ObjectType<{
                            promise: Promise<unknown>
                        }>({
                            propertiesType: {
                                promise: new InstanceType({
                                    theClass: Promise
                                })
                            },
                            defaultValue: "承诺"
                        })
                    }, MethodBlockParam.METHOD, {
                        key: "callback",
                        label: "回调",
                        type: new FunctionType({
                            block: [
                                {
                                    key: "reason",
                                    label: "原因",
                                    type: new AnyType()
                                }
                            ]
                        })
                    }
                ]
            }
        ]
    }],
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

    public awaitResult(promise: { promise: Promise<unknown> }): Promise<unknown> {
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
        generateMethodForFunctions
    ],
    CoCo: {
        decorators: [
            transformMethodsCallbackFunctionsToEvents,
            addThisForMethods,
            addCheck,
            transformIconsExceptWidgetIcon
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
```

## 生成的积木

### CoCo

![CoCo 生成的积木.png](https://s2.loli.net/2025/05/04/C6q1AyiKFcJQwrN.jpg)

### Creation Project

![Creation Project 生成的积木.png](https://s2.loli.net/2025/05/04/WfqGQABScM42Ed9.jpg)
