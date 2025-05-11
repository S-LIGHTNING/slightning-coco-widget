---
sidebar_position: 2
---

# 属性

## PropertyGroup

类型：`object`

描述：属性组。

### PropertyGroup.label?

类型：`string`

描述：属性组标签，设置后生成的一组积木上方会显示该标签。

### PropertyGroup.blockOptions?

类型：同 <code>[PropertyTypes.blockOptions](#propertytypesblockoptions)</code>

描述：属性组积木选项。组内属性的积木选项会继承该选项。

### PropertyGroup.contents

类型：<code>[PropertiesTypes](#propertytypes)</code>

描述：属性组内容。

## PropertyTypes

类型：`object`

描述：属性。

### PropertyTypes.key

类型：`string`

描述：属性的键名，与控件实体中的属性名对应。

### PropertyTypes.label

类型：`string`

描述：属性的标签，作为在编辑器中显示的属性名。

### PropertyTypes.type

类型：<code>[Type](./type)</code>

描述：属性的类型。

### PropertyTypes.blockOptions?

类型：`object`

描述：属性的积木选项。

#### PropertyTypes.blockOptions.get?

类型：<code>boolean | (\{ key?: string \} & [BlockOptionsTypes](./block-options#blockoptionstypes))</code>

描述：取值方法积木选项。

设为 `false` 则不生成取值方法积木。

默认值：`true`

##### PropertyTypes.blockOptions.get.key?

类型：`string`

描述：取值方法的键名，与控件实体中的方法名对应。

默认值：`get${capitalize(key)}`，其中 `capitalize(key)` 为大写首字母的属性键名，例如 `getProperty`。

#### PropertyTypes.blockOptions.set?

类型：<code>boolean | (\{ key?: string \} & [BlockOptionsTypes](./block-options#blockoptionstypes))</code>

描述：赋值方法积木选项。

设为 `false` 则不生成赋值方法积木。

默认值：`true`

##### PropertyTypes.blockOptions.set.key?

类型：`string`

描述：设置属性积木的键。

默认值：`set${capitalize(key)}`，其中 `capitalize(key)` 为大写首字母的属性键名，例如 `setProperty`。
