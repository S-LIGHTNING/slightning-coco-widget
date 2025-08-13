---
sidebar_position: 2
---

# 多行积木

## 普通多行积木

只需给方法设置 `blockOptions.inline = false`，就可以让积木多行显示。

默认一行显示一个参数，方法标签独占一行。

## 指定换行

2.5 版本新增，2.8 版本稳定。

指定换行仍需设置 `blockOptions.inline = false`。

你可以在积木中加入 `MethodBlockParam.BREAK_LINE` 来指定在何处换行。当指定换行后，其他地方将不会自动换行。

若 `blockOptions.inline` 为真，会忽略掉所有 `MethodBlockParam.BREAK_LINE`。
