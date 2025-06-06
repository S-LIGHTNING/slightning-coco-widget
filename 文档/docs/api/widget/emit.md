---
sidebar_position: 1
---

# emit

定义：
```typescript
function emit(this /* 控件实例 */, key: string, ...args: unknown[]): void
```

| 参数 | 描述 |
| --- | --- |
| this | 控件实例 |
| key | 事件键名称，对于没有子类型的事件，该名称与控件类型定义中的键名称一致；对于有子类型的事件，该名称为控件类型定义中事件的键名称与子类型的值首字母大写后依次拼接的结果 |
| args | 事件参数 |

示例：

```typescript
const types: Types = {
    // ...
    events: [
        {
            key: "onEvent",
            label: "事件",
            params: [
                {
                    key: "param1",
                    label: "参数1",
                    type: new StringType()
                }, {
                    key: "param2",
                    label: "参数2",
                    type: new NumberType()
                }
            ]
        }, {
            key: "onEventWithSubTypes",
            label: "带子类型的事件",
            subTypes: [
                {
                    key: "subType0",
                    dropdown: [
                        { label: "测试1", value: "test1" },
                        { label: "测试2", value: "test2" }
                    ]
                }, {
                    key: "subType1",
                    dropdown: [
                        { label: "测试3", value: "test3" },
                        { label: "测试4", value: "test4" }
                    ]
                }
            ],
            params: []
        }
    ]
}
class MyWidget extends getSuperWidget(types) {
    public constructor(props: object) {
        super(props)
        emit.call(this, "onEvent", "参数1", 2)
        emit.call(this, "onEventWithSubTypesTest1Test3")
    }
}
```
