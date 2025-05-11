---
sidebar_position: 4
---

# 事件

## EventTypes

类型：`object`

描述：事件。

### EventTypes.key

类型：`string`

描述：事件的键名，触发事件时需要传入的键名。

### EventTypes.subTypes?

类型：<code>[EventSubType](#eventsubtype)[]</code>

描述：事件的子类型。

**仅在 CoCo 中生效，Creation Project 不支持该特性。**

注：如果要在 Creation Project 中使用该特性，请使用 [`flattenEventSubTypes`](../export/decorators#flatteneventsubtypes) 装饰器将子类型展开。


### EventTypes.label

类型：`string`

描述：事件的标签，作为在编辑器中显示的名称。

### EventTypes.params

类型：<code>[EventParamTypes](#eventparamtypes)[]</code>

描述：事件的参数。触发事件时需要传入的参数，顺序与此处定义的顺序一致。

## EventSubType

类型：`object`

描述：事件子类型。

### EventSubType.key

类型：`string`

描述：子类型的键名。

### EventSubType.dropdown

类型：`{ label: string; value: string }[]`

描述：事件子类型下拉选项。

## EventParamTypes

类型：`object`

描述：事件参数的键名。

### EventParamTypes.key

类型：`string`

描述：参数键。

### EventParamTypes.label

类型：`string`

描述：事件参数的标签，作为在编辑器中显示的名称。

### EventParamTypes.type

类型：<code>[Type](./type)</code>

描述：事件参数的类型。
