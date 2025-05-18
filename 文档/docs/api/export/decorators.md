---
sidebar_position: 2
---

# 装饰器

## generateMethodForFunctions

功能：为传出的函数生成调用方法。

## generateBlockForProperties

功能：为属性生成取值和赋值积木。

:::tip 提示
该装饰器不会处理内置属性。
:::

## transformMethodsThrows

功能：将会抛出异常的方法转为可捕获的形式。

具体来说，该装饰器会对抛出异常的方法做以下转换：

- 删除方法的返回值；
- 为方法添加一个成功回调函数参数，成功回调函数会在方法成功执行后调用；
- 为方法添加一个失败回调函数参数，失败回调函数会在方法出错时调用；

## addTransformMethodsThrows

该装饰器类似于 [`transformMethodsThrows`](#transformmethodsthrows)，除了不会删除转换前的方法。

## transformMethodsCallbackFunctionsToEvents

功能：将回调函数转为事件。

:::tip 提示
该装饰器不会为没有返回值的函数生成返回方法，如果你需要生成返回方法，请将函数的返回值设为 <code>new [VoidType](../../api/types/type#voidtype)()</code>。
:::

:::caution 注意
该装饰器生成的返回积木和抛出积木并不能终止回调积木的执行流程，也就是说，返回积木和抛出积木后面的积木仍然会执行。
:::

## addTransformMethodsCallbackFunctionsToEvents

该装饰器类似于 [`transformMethodsCallbackFunctionsToEvents`](#transformmethodscallbackfunctionstoevents)，除了不会删除转换前的方法。

## transformMethodsCallbackFunctionsToCodeBlocks

功能：将回调函数转为回调积木（即没有返回值和抛出的回调函数）。

:::tip 提示
该装饰器不会转换已经是回调积木的函数。
:::

:::caution 注意
该装饰器生成的返回积木和抛出积木并不能终止回调积木的执行流程，也就是说，返回积木和抛出积木后面的积木仍然会执行。
:::

## addTransformMethodsCallbackFunctionsToCodeBlocks

该装饰器类似于 [`transformMethodsCallbackFunctionsToCodeBlocks`](#transformmethodscallbackfunctionstocodeblocks)，除了不会删除转换前的方法。

## flattenEventSubTypes

功能：拉平事件子类型，使用多个事件替换事件子类型。

## addFlattenEventSubTypes

该装饰器类似于 [`flattenEventSubTypes`](#flatteneventsubtypes)，除了不会删除转换前的事件。

## addThisForMethods

功能：给所有方法的类型定义中添加 `this` 参数。

## addCheck

功能：给所有方法（包括渲染方法）加上调用参数类型检查、弃用检查、异常捕获并输出到控制台。

## transformIcons

功能：把使用到的 CoCo 内置图标转为链接。

## transformIconsExceptWidgetIcon

功能：把除了控件图标以外的（即属性的取值、赋值函数以及方法积木的图标）使用到的 CoCo 内置图标转为链接。
