---
sidebar_position: 2
---

# 装饰器

装饰器可以对控件进行后续修饰。

## API

2.3 版本新增。

### 定义

```
type Decorator = (types: StandardTypes, widget: Widget) => [StandardTypes, Widget]
```

可见，装饰器的实质是一个函数，它接收两个参数，分别是控件类型定义和控件实体定义，并返回处理后的控件类型定义和控件实体定义。

### 装饰器工具

#### 遍历标准控件类型定义

使用 `traverseTypes` 方法可以轻松遍历控件的标准类型定义。

`traverseTypes` 相关定义如下：

```typescript
declare traverseTypes(types: StandardTypes, visitors: TypesVisitors): void

interface TypesVisitors {
    PropertyGroup?: TypesNodeVisitor<PropertyGroupNode> | null | undefined
    PropertyTypes?: TypesNodeVisitor<PropertyTypesNode> | null | undefined
    MethodGroup?: TypesNodeVisitor<MethodGroupNode> | null | undefined
    MethodTypes?: TypesNodeVisitor<MethodTypesNode> | null | undefined
    EventTypes?: TypesNodeVisitor<EventTypesNode> | null | undefined
    BlockBoxOptions?: TypesNodeVisitor<BlockBoxOptionsNode> | null | undefined
}

type TypesNodeVisitor<T extends TypesNode<unknown, unknown>> = ((node: T) => void) | {
    enter?: ((node: T) => void) | null | undefined
    /**
     * @deprecated 该方法是由于早期拼写错误而保留的，请不要使用。
     */
    entry?: ((node: T) => void) | null | undefined
    exit?: ((node: T) => void) | null | undefined
}

declare class TypesNode<T, U = T> {

    public readonly group?: TypesNode<(T | U), (T | U)> | null | undefined
    public readonly groupContents: (T | U)[]
    public readonly index: { value: number }
    /**
     * 节点对应的类型定义。
     */
    public readonly value: T
    /**
     * 节点的积木选项。与`this.value.blockOptions`不同的是，该项包含从组中继承的积木选项。
     */
    public get blockOptions(): T extends {
        blockOptions?: {} | null | undefined
    } ? NonNullable<T["blockOptions"]> : {}
    public isRemoved: boolean

    public traverse(this: this, visitors: TypesVisitors): void
    public remove(this: this): void
    public replaceWith(this: this, ...values: (T | U)[]): void
    public insertAfter(this: this, ...values: (T | U)[]): void
}

declare class PropertyGroupNode extends TypesNode<StandardPropertyGroup, StandardPropertiesItem> {}
declare class PropertyTypesNode extends TypesNode<StandardPropertyTypes, StandardPropertiesItem> {}
declare class MethodGroupNode extends TypesNode<StandardMethodGroup, StandardMethodsItem> {}
declare class MethodTypesNode extends TypesNode<StandardMethodTypes, StandardMethodsItem> {}
declare class EventTypesNode extends TypesNode<StandardEventTypes, StandardMethodsItem> {}
declare class BlockBoxOptionsNode extends TypesNode<BlockBoxOptions, StandardMethodsItem> {}
```

## 内置装饰器

### generateMethodForFunctions

功能：为传出的函数生成调用方法。

### generateBlockForProperties

功能：为属性生成取值和赋值积木。

:::tip 提示
该装饰器不会处理内置属性。
:::

### transformMethodsThrows

功能：将会抛出异常的方法转为可捕获的形式。

具体来说，该装饰器会对抛出异常的方法做以下转换：

- 删除方法的返回值；
- 为方法添加一个成功回调函数参数，成功回调函数会在方法成功执行后调用；
- 为方法添加一个失败回调函数参数，失败回调函数会在方法出错时调用；

### addTransformMethodsThrows

该装饰器类似于 [`transformMethodsThrows`](#transformmethodsthrows)，除了不会删除转换前的方法。

### transformMethodsCallbackFunctionsToEvents

功能：将回调函数转为事件。

:::tip 提示
该装饰器不会为没有返回值的函数生成返回方法，如果你需要生成返回方法，请将函数的返回值设为 <code>new [VoidType](../../api/types/type#voidtype)()</code>。
:::

:::caution 注意
该装饰器生成的返回积木和抛出积木并不能终止回调积木的执行流程，也就是说，返回积木和抛出积木后面的积木仍然会执行。
:::

### addTransformMethodsCallbackFunctionsToEvents

该装饰器类似于 [`transformMethodsCallbackFunctionsToEvents`](#transformmethodscallbackfunctionstoevents)，除了不会删除转换前的方法。

### transformMethodsCallbackFunctionsToCodeBlocks

功能：将回调函数转为回调积木（即没有返回值和抛出的回调函数）。

:::tip 提示
该装饰器不会转换已经是回调积木的函数。
:::

:::caution 注意
该装饰器生成的返回积木和抛出积木并不能终止回调积木的执行流程，也就是说，返回积木和抛出积木后面的积木仍然会执行。
:::

### addTransformMethodsCallbackFunctionsToCodeBlocks

该装饰器类似于 [`transformMethodsCallbackFunctionsToCodeBlocks`](#transformmethodscallbackfunctionstocodeblocks)，除了不会删除转换前的方法。

### transformMutator

2.4 版本新增。

功能：将使用变更器的方法转换为多个方法。

### addTransformMutator

2.4 版本新增。

该装饰器类似于 [`transformMutator`](#transformmutator)，除了不会删除转换前的方法。

### flattenEventSubTypes

功能：拉平事件子类型，使用多个事件替换事件子类型。

### addFlattenEventSubTypes

该装饰器类似于 [`flattenEventSubTypes`](#flatteneventsubtypes)，除了不会删除转换前的事件。

### addThisForMethods

功能：给所有方法的类型定义中添加 `this` 参数。

### addCheck

功能：给所有方法（包括渲染方法）加上调用参数类型检查、弃用检查、异常捕获并输出到控制台。

### transformIcons

功能：把使用到的 CoCo 内置图标转为链接。

### transformIconsExceptWidgetIcon

功能：把除了控件图标以外的（即属性的取值、赋值函数以及方法积木、事件积木的图标）使用到的 CoCo 内置图标转为链接。
