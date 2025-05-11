---
sidebar_position: 5
---

# 积木选项

## BlockOptionsTypes

类型：`object`

描述：积木选项。

### BlockOptionsTypes.icon?

类型：`string`

描述：积木图标链接，设置后会在积木前显示图标。

**仅在 CoCo 中生效，Creation Project 不支持该特性。**

### BlockOptionsTypes.color?

类型：`string`

描述：积木的颜色。

### BlockOptionsTypes.inline?

类型：`boolean`

描述：是否在一行显示。

如果设为 `false`，则生成的积木会显示为多行，第一行显示方法标签和 `this` 参数，后面几行显示其他参数。

默认值：`true`

### BlockOptionsTypes.deprecated?

类型：`boolean | string`

描述：是否已被弃用。

已弃用的方法具有以下特点：

- 积木前会显示 `[已弃用]` 标签；
- 积木显示为灰色（覆盖 `color` 选项）；
- tooltip 中会提示弃用；
- 调用时会显示警告。

设为 `true` 表示方法已弃用。

设为 `string` 表示弃用说明，默认弃用说明为“该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法”。

默认值：`false`
