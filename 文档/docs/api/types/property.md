---
sidebar_position: 2
---

# 属性

## PropertyGroup

类型：`object`

描述：属性组。

### PropertyGroup.label?

类型：`string`

描述：属性组名称。

### PropertyGroup.blockOptions?

类型：同 `PropertyTypes.blockOptions`

描述：属性组积木选项。

### PropertyGroup.contents

类型：`PropertiesTypes`

描述：属性组内容。

## PropertyTypes

类型：`object`

描述：属性。

### PropertyTypes.key

类型：`string`

描述：属性键。

### PropertyTypes.label

类型：`string`

描述：属性名称。

### PropertyTypes.type

类型：`Type`

描述：属性类型。

### PropertyTypes.blockOptions?

类型：`object`

描述：属性积木选项。

#### PropertyTypes.blockOptions.get?

类型：`boolean | ({ key?: string } & BlockOptionsTypes)`

描述：获取属性积木选项，`false` 表示不生成获取属性积木。

默认值：`true`

##### PropertyTypes.blockOptions.get.key?

类型：`string`

描述：获取属性积木的键。

默认值：get[属性键]，例如 `getProperty`。

#### PropertyTypes.blockOptions.set?

类型：`boolean | ({ key?: string } & BlockOptionsTypes)`

描述：设置属性积木选项，`false` 表示不生成设置属性积木。

默认值：`true`

##### PropertyTypes.blockOptions.set.key?

类型：`string`

描述：设置属性积木的键。

默认值：set[属性键]，例如 `setProperty`。
