---
sidebar_position: 6
---

# 类型

## VoidType

定义：

```typescript
declare class VoidType extends Type<void> {
    public constructor()
}
```

描述：没有任何值，仅可用于函数的返回值类型，表示函数不返回任何值。

## StringType

定义：

```typescript
declare enum StringInputType {
    INLINE, MULTILINE, RICH
}

declare class StringType extends Type<string> {

    public readonly defaultValue: string
    public readonly inputType: StringInputType

    public constructor(props: {
        defaultValue?: string | null | undefined
        inputType?: StringInputType | null | undefined
    } | string = {})
}
```

描述：字符串类型和输入类型。

- `defaultValue`：指定字符串的默认值；
- `inputType`：指定字符串的输入类型，可以是 `INLINE`（单行文本），`MULTILINE`（多行文本），或 `RICH`（富文本）

2.3 版本新增：当传入参数类型为字符串时，表示字符串的默认值。

## IntegerType

定义：

```typescript
declare class IntegerType extends Type<number> {

    public readonly defaultValue: number
    public readonly range: Range | null | undefined

    public constructor(props: {
        defaultValue?: number | null | undefined
        range?: Range | null | undefined
    } | number = {})
}
```

描述：整数类型和取值范围。

- `defaultValue`：指定整数的默认值，默认为 `0`；
- `range`：可选参数，指定整数的取值范围。

## NumberType

定义：

```typescript
declare class NumberType extends Type<number> {

    public readonly defaultValue: number
    public readonly range: Range | null | undefined

    public constructor(props: {
        defaultValue?: number | null | undefined
        range?: Range | null | undefined
    } = {})
}
```

描述：数字类型和取值范围。

- `defaultValue`：指定数字的默认值，默认为 `0`；
- `range`：可选参数，指定数字的取值范围。

2.3 版本新增：当传入参数类型为数字时，表示数字的默认值。

## BooleanType

定义：

```typescript
declare class BooleanType extends Type<boolean> {

    public readonly defaultValue: boolean

    public constructor(props: {
        defaultValue?: boolean | null | undefined
    } | boolean = {})
}
```

描述：布尔类型。

- `defaultValue`：指定布尔值的默认值，默认为 `false`。

2.3 版本新增：当传入参数类型为布尔值时，表示布尔值的默认值。

## AnyType

定义：

```typescript
declare class AnyType extends Type<any> {
    public constructor(props: {
        defaultValue?: any | null | undefined
    } | string | number | boolean = {})
}
```

描述：任意类型，可以接受任何值。

- `defaultValue`：默认值。

2.3 版本新增：当传入参数类型为字符串、数字或布尔值时，表示默认值。

## StringEnumType

定义：

```typescript
declare enum StringEnumInputType {
    DROPDOWN, OPTION_SWITCH
}

type StandardEntry = { label: string, value: string }

type Entry = ({ label: string, value: string } | [string, string] | string)

export class StringEnumType<T extends string> implements Type<T> {

    public readonly entries: StandardEntry[]
    public readonly inputType: StringEnumInputType
    public readonly valueToLabelMap: Record<string, string>
    public readonly values: string[]

    public constructor(props: {
        entries: Entry[]
        inputType?: StringEnumInputType | null | undefined
    } | Entry[])
}
```

描述：字符串枚举类型，可以指定枚举项和显示方式。

- `entries`：枚举项数组，`label` 或数组第一项是在编辑器中显示的选项标签，`value` 或数组第二项是选项的值，字符串表示选项标签和值；
- `inputType`：枚举的输入方式，可以是 `DROPDOWN`（下拉框）或 `OPTION_SWITCH`（选项开关）；
- `valueToLabelMap`：`value` 到 `label` 的映射。

2.3 版本新增：可以直接传入枚举项数组。

## ObjectType

定义：

```typescript
declare class ObjectType<T extends {}> extends Type<T> {

    public readonly propertiesType: {
        [K in keyof T]: Type<T[K]>
    } | null | undefined
    public readonly defaultValue: T | string

    public constructor(props: {
        propertiesType?: {
            [K in keyof T]: Type<T[K]>
        }
        defaultValue?: T | string | null | undefined
    } = {})
}
```

描述：对象类型，支持属性类型校验。

- `propertiesType`：对象属性类型定义；
- `defaultValue`：对象的默认值，可以是对象或字符串。

## ArrayType

定义：

```typescript
declare class ArrayType<T> extends Type<T[]> {

    public readonly itemType: Type<T> | null | undefined
    public readonly defaultValue: T[] | string

    public constructor(props: {
        itemType?: Type<T> | null | undefined
        defaultValue?: T[] | string | null | undefined
    } = {})
}
```

描述：数组类型和元素类型。

- `itemType`：数组元素的类型；
- `defaultValue`：数组的默认值，可以是数组或字符串。

## ColorType

定义：

```typescript
declare class ColorType extends Type<string> {

    public readonly defaultValue: string

    public constructor(props: {
        defaultValue?: string | null | undefined
    } | string = {})
}
```

描述：颜色类型。

- `defaultValue`：指定颜色的默认值。

2.3 版本新增：当传入参数类型为字符串时，表示颜色的默认值。

## ImageType

定义：

```typescript
declare class ImageType extends Type<string> {

    public readonly defaultValue: string

    public constructor(props: {
        defaultValue?: string | null | undefined
    } | string = {})
}
```

描述：图片类型。

- `defaultValue`：指定图片的默认值。

2.3 版本新增：当传入参数类型为字符串时，表示图片的默认值。

## AudioType

定义：

```typescript
declare class AudioType extends Type<string> {

    public readonly defaultValue: string

    public constructor(props: {
        defaultValue?: string | null | undefined
    } | string = {})
}
```

描述：音频类型。

- `defaultValue`：指定音频的默认值。

2.3 版本新增：当传入参数类型为字符串时，表示音频的默认值。

## VideoType

定义：

```typescript
declare class VideoType extends Type<string> {

    public readonly defaultValue: string

    public constructor(props: {
        defaultValue?: string | null | undefined
    } | string = {})
}
```

描述：视频类型。

- `defaultValue`：指定视频的默认值。

2.3 版本新增：当传入参数类型为字符串时，表示视频的默认值。

## UnionType

定义：

```typescript
declare class UnionType<T> extends Type<T> {

    public readonly types: Type<T>[]
    public readonly defaultValue: string | number | boolean

    public constructor(...types: Type<T>[])
}
```

描述：联合类型，可以包含多个类型，表示其中任意一个类型。

- `types`：联合类型包含的类型数组；
- `defaultValue`：联合类型的默认值，一般为第一个包含的类型的字符串、数字或布尔值类型的默认值。

## InstanceOfClassType

定义：

```typescript
declare class InstanceOfClassType<T> extends Type<T> {

    public readonly theClass: new (...args: any[]) => T
    public readonly defaultValue: string

    public constructor(props: {
        theClass: new (...args: any[]) => T
        defaultValue?: string | null | undefined
    } | (new (...args: any[]) => T))
}
```

描述：实例类型，用于验证值是否为指定类的实例。

- `theClass`：类构造函数，用于实例类型检查；
- `defaultValue`：默认值字符串。

2.3 版本新增：当传入类构造函数时，表示用于实例类型检查的类构造函数。

## FunctionType

定义：

```typescript
declare class FunctionType<A extends unknown[], R> extends Type<(...args: A) => R> {

    public readonly block: MethodBlockTypes
    public readonly returns?: Type | null | undefined
    public readonly throws?: Type | null | undefined
    public readonly defaultValue?: string | null | undefined
    public readonly raw: boolean

    public constructor(props: {
        block: MethodBlockTypes
        returns?: Type | null | undefined
        throws?: Type | null | undefined
        defaultValue?: string | null | undefined
        raw?: boolean | null | undefined
    })
}
```

描述：函数类型。

- `block`：函数对应的积木，类似于控件方法类型定义中的 `block` 属性；
- `returns`：返回值类型；
- `throws`：抛出异常类型；
- `defaultValue`：默认值字符串；
- `raw`：是否保持原始，若为是，则不会被装饰器转换。

:::tip 提示
你可能需要结合 [`generateMethodForFunctions`](../export/decorators.md#generatemethodforfunctions)、[`transformMethodsCallbackFunctionsToEvents`](../export/decorators.md#transformmethodscallbackfunctionstoevents)、[`transformMethodsCallbackFunctionsToCodeBlocks`](../export/decorators.md#transformmethodscallbackfunctionstocodeblocks) 这几个装饰器以更好地使用函数类型。
:::
