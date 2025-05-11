---
sidebar_position: 2
---

# 装饰器

## generateMethodForFunctions

功能：为传出的函数生成调用方法

## generateBlockForProperties

功能：为属性生成取值和赋值积木。

:::tip 提示
该装饰器不会处理内置属性。
:::

## transformMethodsThrows

功能：将会抛出异常的方法转为可捕获的形式。

具体来说，该装饰器会对抛出异常的方法做以下转换：

- 将方法的返回值改为一个类似于 `Promise` 的对象；
- 为方法生成一个继续方法，继续方法的作用是获取方法的返回值，如果方法出错，则输出错误信息，类似于使用 `await`；
- 为方法生成一个然后方法，然后方法接收一个回调函数，然后在方法成功执行后调用回调函数，类似于 `.then()`；
- 为方法生成一个捕获方法，捕获方法接收一个错误处理函数，然后在方法出错时调用该函数，类似于 `.catch()`。

## transformMethodsCallbackFunctionsToEvents

功能：将回调函数转为事件。

:::tip 提示
该装饰器不会为没有返回值的函数生成返回方法，如果你需要生成返回方法，请将函数的返回值设为 <code>new [VoidType](../../api/types/type#voidtype)()</code>。
:::

## transformMethodsCallbackFunctionsToCodeBlocks

功能：将回调函数转为回调积木（即没有返回值和抛出的回调函数）。

:::tip 提示
该装饰器不会转换已经是回调积木的函数。
:::

## flattenEventSubTypes

功能：拉平事件子类型，使用多个事件替换事件子类型。

## addThisForMethods

功能：给所有方法的类型定义中添加 `this` 参数。

## addCheck

功能：给所有方法（包括渲染方法）加上调用参数类型检查、弃用检查、异常捕获并输出到控制台。

## transformIcons

功能：把使用到的 CoCo 内置图标转为链接。

## transformIconsExceptWidgetIcon

功能：把除了控件图标以外的（即属性的取值、赋值函数以及方法积木的图标）使用到的 CoCo 内置图标转为链接。
