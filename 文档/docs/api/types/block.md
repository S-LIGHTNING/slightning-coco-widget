---
sidebar_position: 5
---

# 积木

## BlockType

2.3 版本新增。

枚举类型：

- `METHOD`：表示类型为方法。
- `EVENT`：表示类型为事件。

## BlockBoxOptions

2.3 版本新增。

类型：`object`

描述：积木盒选项，用于调整积木布局。

### BlockBoxOptions.space?

类型：`number`

描述：积木间距。

## BlockBoxOptions.line?

类型：`string`

描述：在积木上方显示的提示

## ~~BlockOptionsTypes~~

:::caution 警告
该属性已在 2.3 版本中更名为 BlockOptions，该属性是为兼容性考虑而添加的，请尽快迁移到 [BlockOptions](#blockoptions)。
:::

## BlockOptions

类型：`object`

描述：积木选项。

### BlockOptions.icon?

类型：`string`

描述：积木图标链接，设置后会在积木前显示图标。

**仅在 CoCo 中生效，Creation Project 不支持该特性。**

### BlockOptions.color?

类型：`string`

描述：积木的颜色。

### BlockOptions.inline?

类型：`boolean`

描述：是否在一行显示。

如果设为 `false`，则生成的积木会显示为多行。

默认值：`true`

### ~~BlockOptions.deprecated~~?

:::caution 警告
该选项已在 2.3 版本中弃用，并可能在将来的版本中移除，请改用方法或事件的 `deprecated` 选项。
:::

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

### BlockOptions.previousStatement?

2.8 版本新增。

仅方法积木支持该属性。

类型：`boolean`

规定积木是否能与上一块积木拼接，仅在方法无返回值时生效。

**仅在 Creation Project 中生效，CoCo 不支持该特性。**

### BlockOptions.nextStatement?

2.8 版本新增。

仅方法积木支持该属性。

类型：`boolean`

规定积木是否能与下一块积木拼接，仅在方法无返回值时生效。

**仅在 Creation Project 中生效，CoCo 不支持该特性。**
