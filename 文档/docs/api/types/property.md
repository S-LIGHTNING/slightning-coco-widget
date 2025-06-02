---
sidebar_position: 2
---

# 属性

## PropertiesTypes

等于 <code>([PropertyGroup](#propertygroup) | [PropertyTypes](#propertytypes))[]</code>

## PropertyGroup

类型：`object`

描述：属性组。

### PropertyGroup.label?

类型：`string`

描述：属性组标签，设置后生成的一组积木上方会显示该标签。

### PropertyGroup.blockOptions?

类型：同 <code>[PropertyTypes.blockOptions](#propertytypes--propertytypes3blockoptions)</code>

描述：属性组积木选项。组内属性的积木选项会继承该选项。

### PropertyGroup.contents

类型：<code>[PropertiesTypes](#propertytypes)</code>

描述：属性组内容。

## PropertyTypes

类型：`object | Array`

`Array` 是 2.3 版本新增的。

描述：属性。

### PropertyTypes.key | PropertyTypes[0]

类型：`string`

描述：属性的键名，与控件实体中的属性名对应。

### PropertyTypes.label | PropertyTypes[1]

类型：`string`

描述：属性的标签，作为在编辑器中显示的属性名。

### PropertyTypes.type

类型：<code>[Type](./type)</code>

### PropertyTypes[2]

类型：`string | number | boolean | DropdownItem[] | Type`

描述：属性的类型或默认值。
- 当类型为 `Type` 时，表示属性的类型；
- 当类型为 `string`、`number`、`boolean`、`DropdownItem[]` 时，表示属性的默认值，属性的类型按照如下规则自动推断：
  - `string`：类型为 `StringType`；
  - `number`：类型为 `NumberType`；
  - `boolean`：类型为 `BooleanType`；
  - `DropdownItem[]`：类型为 `StringEnumType`。

### (PropertyTypes | PropertyTypes[3]).blockOptions?`

类型：`object`

描述：属性的积木选项。

#### (PropertyTypes | PropertyTypes[3]).blockOptions.get?

类型：<code>boolean | (\{ key?: string \} & [BlockOptions](./block#blockoptions))</code>

描述：取值方法积木选项。

设为 `false` 则不生成取值方法积木。

默认值：`true`

##### (PropertyTypes | PropertyTypes[3]).blockOptions.get.key?

类型：`string`

描述：取值方法的键名，与控件实体中的方法名对应。

默认值：`get${capitalize(key)}`，其中 `capitalize(key)` 为大写首字母的属性键名，例如 `getProperty`。

#### (PropertyTypes | PropertyTypes[3]).blockOptions.set?

类型：<code>boolean | (\{ key?: string \} & [BlockOptions](./block#blockoptions))</code>

描述：赋值方法积木选项。

设为 `false` 则不生成赋值方法积木。

默认值：`true`

##### (PropertyTypes | PropertyTypes[3]).blockOptions.set.key?

类型：`string`

描述：设置属性积木的键。

默认值：`set${capitalize(key)}`，其中 `capitalize(key)` 为大写首字母的属性键名，例如 `setProperty`。
