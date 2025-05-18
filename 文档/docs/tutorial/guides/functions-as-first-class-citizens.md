---
sidebar_position: 2
---

# 函数一等公民

:::tip 提示
尽管由于编辑器的限制，自定义控件并不能实现真正意义上的函数是一等公民，但 SCW 提供了一些方法使得在自定义控件中可以实现部分的函数是一等公民。
:::

## 传出函数

由自定义控件向外界输出的函数，可以被称为“传出函数”。如事件函数类型的参数、回调函数类型的参数、方法函数类型的返回值等。然而，在编辑器中并不能直接使用这些由自定义控件传出的函数。为了使得这些函数可以被调用，你可以使用 [`generateMethodForFunctions`](../../api/export/decorators#generatemethodforfunctions) 为这些传出函数生成对应的调用方法。

你可以参考示例 [封装 JS 承诺（Promise）](../../example/promise) 来了解更多信息。

## 回调函数

CoCo 没有对自定义控件的回调函数提供直接的支持，为了能在 CoCo 中使用回调函数，你可以使用 [`transformMethodCallbacksToEvents`](../../api/export/decorators#transformmethodscallbackfunctionstoevents) 装饰器将回调函数转换为事件。

该装饰器会为回调函数生成对应的事件，当回调函数被调用时，会触发对应的事件。在事件中可以调用返回和抛出方法来模拟函数的行为。

在 CoCo 中，由于事件与调用方法不在同一个闭包中，可能导致上下文数据丢失，为此，SCW 会为事件添加一个 `上下文` 参数，用于在调用方法与事件之间传递上下文数据。

在 Creation Project 中，仅仅支持回调积木（即没有返回值的函数），你可以使用 [`transformMethodCallbacksToCodeBlocks`](../../api/export/decorators#transformmethodscallbackfunctionstocodeblocks) 装饰器将回调函数转换为代码块，SCW 会为回调函数生成返回方法和抛出方法，以模拟函数的行为。

:::tip 提示
这些装饰器不会为没有返回值的函数生成返回方法，如果你需要生成返回方法，请将函数的返回值设为 <code>new [VoidType](../../api/types/type#voidtype)()</code>。
:::

:::caution 注意
这些装饰器生成的返回积木和抛出积木并不能终止回调积木的执行流程，也就是说，返回积木和抛出积木后面的积木仍然会执行。
:::

你可以参考示例 [封装 JS 高级列表操作](../../example/advanced-list-operations) 来了解更多信息。
