---
sidebar_position: 2
---

# Logger

## 构造函数

定义：
```typescript
declare class Logger {
    constructor(types: Types, widget: /* 控件实例 */)
}
```

| 参数 | 描述 |
| --- | --- |
| types | 控件类型定义 |
| widget | 控件实例 |

## 日志方法

定义：

```typescript
declare class Logger {
    log(...messages: unknown[]): void
    info(...messages: unknown[]): void
    warn(...messages: unknown[]): void
    error(...messages: unknown[]): void
}
```

说明：一般日志消息会被同时输出到编辑器控制台和浏览器控制台。

特殊的，`log` 输出简单消息（不含函数和对象的消息）时只会输出到编辑器控制台，不会输出到浏览器控制台。

支持输出复杂消息，就像 `console.log` 一样。
