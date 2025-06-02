---
sidebar_position: 3
---

# 方法

## MethodsTypes

等于 <code>([MethodGroup](#methodgroup) | [MethodTypes](#methodtypes) | (\{ type: [BlockType](./block#blocktype).EVENT \} & [EventTypes](./event#eventtypes)) | [[BlockType](./block#blocktype).EVENT, ...[EventTypes](./event#eventtypes)] | [BlockBoxOptions](./block#blockboxoptions))[]</code>

## MethodGroup

类型：`object`

描述：方法组。

### MethodGroup.label?

类型：`string`

描述：方法组标签，设置后生成的一组积木上方会显示该标签。

### MethodGroup.blockOptions?

类型：<code>[BlockOptions](./block#blockoptions)</code>

描述：方法组积木选项。组内方法的积木选项会继承该选项。

### MethodGroup.contents

类型：<code>[MethodsTypes](#methodstypes)</code>

描述：方法组内容。

## MethodTypes

类型：`object | Array`

`Array` 是 2.3 版本新增的。

描述：方法。

### MethodTypes.key | MethodTypes[0]

类型：`string`

描述：方法的键名，与控件实体中的方法名对应。

### MethodTypes.label | MethodTypes[1]

类型：`string`

描述：方法的标签。

### MethodTypes.block | MethodTypes[2]

类型：<code>(string | [MethodBlockParam](#methodblockparam) | [MethodParamTypes](#methodparamtypes))[]</code>

描述：方法的积木。

可以是以下内容：

- <code>[MethodBlockParam.THIS](#methodblockparam)</code>：`this` 参数，即控件实例本身，`this` 参数必须是第一个参数。
- <code>[MethodBlockParam.METHOD](#methodblockparam)</code>：方法标签文本。
- 字符串：说明文本。
- MethodParamTypes：方法参数。

### (MethodTypes.returns | MethodTypes[3])?

类型：<code>[Type](./type)</code>

描述：方法的返回值类型。

不设置或设置为空时，表示没有返回值。

### (MethodTypes | MethodTypes[4]).throws?

类型：<code>[Type](./type)</code>

描述：方法的抛出异常类型。

不设置或设置为空时，表示不会抛出异常。

### (MethodTypes | MethodTypes[4]).tooltip?

类型：`string`

描述：方法提示信息，当鼠标悬停在积木上时显示。

### (MethodTypes | MethodTypes[4]).deprecated?

2.3 版本新增。

类型：`boolean | string`

描述：是否已被弃用。

已弃用的方法具有以下特点：

- 积木前会显示 `[已弃用]` 标签；
- 积木显示为灰色（覆盖 `color` 选项）；
- tooltip 中会提示弃用；
- 调用时会显示警告。

设为 `true` 表示方法已弃用。

设为 `string` 表示弃用说明，默认弃用说明为“该方法已弃用，并且可能在未来版本中移除，请尽快迁移到其他方法”。

### (MethodTypes | MethodTypes[4]).blockOptions?

类型：<code>[BlockOptions](./block#blockoptions)</code>

描述：方法积木选项。

## MethodBlockParam

枚举类型：

- `THIS`：控件实例。
- `METHOD`：方法标签。

## MethodParamTypes

类型：`object | Array`

`Array` 是 2.3 版本新增的。

描述：方法参数。

### MethodParamTypes.key | MethodParamTypes[0]

类型：`string`

描述：参数的键名。

### MethodParamTypes.label | MethodParamTypes[1]

类型：`string`

描述：参数的标签。

### MethodParamTypes.type

类型：<code>[Type](./type)</code>

描述：参数的类型。

### MethodParamTypes[2]

类型：`string | number | boolean | DropdownItem[] | Type`

描述：参数的类型或默认值。
- 当类型为 `Type` 时，表示参数的类型；
- 当类型为 `string`、`number`、`boolean`、`DropdownItem[]` 时，表示参数的默认值，参数的类型按照如下规则自动推断：
  - `string`：类型为 `StringType`；
  - `number`：类型为 `NumberType`；
  - `boolean`：类型为 `BooleanType`；
  - `DropdownItem[]`：类型为 `StringEnumType`。
