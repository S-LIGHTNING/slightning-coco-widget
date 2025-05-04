---
sidebar_position: 3
---

# 方法

## MethodGroup

类型：`object`

描述：方法组。

### MethodGroup.label?

类型：`string`

描述：方法组名称。

### MethodGroup.blockOptions?

类型：`BlockOptionsTypes`

描述：方法组积木选项。

### MethodGroup.contents

类型：`(MethodGroup | MethodTypes)[]`

描述：方法组内容。

## MethodTypes

类型：`object`

描述：方法。

### MethodTypes.key

类型：`string`

描述：方法键。

### MethodTypes.label

类型：`string`

描述：方法名称。

### MethodTypes.block

类型：`(string | MethodBlockParam | MethodParamTypes)[]`

描述：方法积木。

### MethodTypes.returns?

类型：`Type`

描述：方法返回值类型。

### MethodTypes.throws?

类型：`Type`

描述：方法异常类型。

### MethodTypes.tooltip?

类型：`string`

描述：方法提示信息，当鼠标悬停在积木上时显示。

### MethodTypes.blockOptions?

类型：`BlockOptionsTypes`

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

描述：参数键。

### MethodParamTypes.label

类型：`string`

描述：参数名称。

### MethodParamTypes.type

类型：`Type`

描述：参数类型。
