---
sidebar_position: 4
---

# 事件

## EventTypes

类型：`object | Array`

`Array` 是 2.3 版本新增的。

描述：事件。

### EventTypes.key | EventTypes[0]

类型：`string`

描述：事件的键名，触发事件时需要传入的键名。

### EventTypes.label | EventTypes[1]

类型：`string`

描述：事件的标签，作为在编辑器中显示的名称。

### (EventTypes.subTypes | EventTypes[2])?

类型：<code>[EventSubType](#eventsubtype)[]</code>

描述：事件的子类型。

**仅在 CoCo 中生效，Creation Project 不支持该特性。**

注：如果要在 Creation Project 中使用该特性，请使用 [`flattenEventSubTypes`](../export/decorators#flatteneventsubtypes) 装饰器将子类型展开。

### EventTypes.params | EventTypes[2] | EventTypes[3]

类型：<code>[EventParamTypes](#eventparamtypes)[]</code>

描述：事件的参数。触发事件时需要传入的参数，顺序与此处定义的顺序一致。

### (EventTypes | EventTypes[3] | EventTypes[4]).tooltip?

类型：`string`

描述：事件的提示信息，当鼠标悬停在积木上时显示。

**仅在 CoCo 中生效，Creation Project 不支持该特性。**

### (EventTypes | EventTypes[3] | EventTypes[4]).deprecated?

2.3 版本新增。

类型：`boolean | string`

描述：是否已被弃用。

已弃用的事件具有以下特点：

- 积木前会显示 `[已弃用]` 标签；
- 积木显示为灰色（如果可以做到的话）（覆盖 `color` 选项）；
- tooltip 中会提示弃用；
- 使用事件时会显示警告（如果可以做到的话）。

设为 `true` 表示事件已弃用。

设为 `string` 表示弃用说明，默认弃用说明为“该事件已弃用，并且可能在未来版本中移除，请尽快迁移到其他事件”。

### (EventTypes | EventTypes[3] | EventTypes[4]).blockOptions?

类型：<code>[BlockOptions](./block#blockoptions)</code>

描述：事件积木选项。

**仅在 CoCo 中生效，Creation Project 不支持该特性。**

## EventSubType

类型：`object | Array`

`Array` 是 2.3 版本新增的。

描述：事件子类型。

### EventSubType.key | EventSubType[0]

类型：`string`

描述：子类型的键名。

### EventSubType.dropdown  | EventSubType[1]

类型：`({ label: string; value: string } | [string, string])[]`

`[string, string]` 是 2.3 版本新增的。

描述：事件子类型下拉选项。

## EventParamTypes

类型：`object | Array`

`Array` 是 2.3 版本新增的。

描述：事件参数的键名。

### EventParamTypes.key | EventParamTypes[0]

类型：`string`

描述：参数键。

### EventParamTypes.label | EventParamTypes[1]

类型：`string`

描述：事件参数的标签，作为在编辑器中显示的名称。

### EventParamTypes.type | EventParamTypes[2]

类型：<code>[Type](./type)</code>

描述：事件参数的类型。
