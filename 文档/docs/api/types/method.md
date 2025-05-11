---
sidebar_position: 3
---

# 方法

## MethodGroup

类型：`object`

描述：方法组。

### MethodGroup.label?

类型：`string`

描述：方法组标签，设置后生成的一组积木上方会显示该标签。

### MethodGroup.blockOptions?

类型：<code>[BlockOptionsTypes](./block-options#blockoptionstypes)</code>

描述：方法组积木选项。组内方法的积木选项会继承该选项。

### MethodGroup.contents

类型：<code>([MethodGroup](#methodgroup) | [MethodTypes](#methodtypes))[]</code>

描述：方法组内容。

## MethodTypes

类型：`object`

描述：方法。

### MethodTypes.key

类型：`string`

描述：方法的键名，与控件实体中的方法名对应。

### MethodTypes.label

类型：`string`

描述：方法的标签。

### MethodTypes.block

类型：<code>(string | [MethodBlockParam](#methodblockparam) | [MethodParamTypes](#methodparamtypes))[]</code>

描述：方法的积木。

可以是以下内容：

- <code>[MethodBlockParam.THIS](#methodblockparam)</code>：`this` 参数，即控件实例本身，`this` 参数必须是第一个参数。
- <code>[MethodBlockParam.METHOD](#methodblockparam)</code>：方法标签文本。
- 字符串：说明文本。
- MethodParamTypes：方法参数。

### MethodTypes.returns?

类型：<code>[Type](./type)</code>

描述：方法的返回值类型。

不设置或设置为空时，表示没有返回值。

### MethodTypes.throws?

类型：<code>[Type](./type)</code>

描述：方法的抛出异常类型。

不设置或设置为空时，表示不会抛出异常。

### MethodTypes.tooltip?

类型：`string`

描述：方法提示信息，当鼠标悬停在积木上时显示。

### MethodTypes.blockOptions?

类型：<code>[BlockOptionsTypes](./block-options#blockoptionstypes)</code>

描述：方法积木选项。

## MethodBlockParam

枚举类型：

- `THIS`：控件实例。
- `METHOD`：方法标签。

## MethodParamTypes

类型：`object`

描述：方法参数。

### MethodParamTypes.key

类型：`string`

描述：参数的键名。

### MethodParamTypes.label

类型：`string`

描述：参数的标签。

### MethodParamTypes.type

类型：<code>[Type](./type)</code>

描述：参数的类型。
