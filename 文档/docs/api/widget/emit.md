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
| key | 事件名称 |
| args | 事件参数 |

示例：

```typescript
class MyWidget extends getSuperWidget(types) {
    public constructor(props: object) {
        super(props)
        emit.call(this, "event", "参数1", 2)
    }
}
```
