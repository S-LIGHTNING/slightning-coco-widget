---
sidebar_position: 4
---

# 检查

使用 [`addCheck`](../../api/export/decorators#addcheck) 装饰器给控件添加检查。

该装饰器会检查：

- 控件是否被正常构造；
- 方法是否已被弃用；
- 调用方法时传入的参数的类型是否正确；
- 方法是否抛出异常（包括渲染方法）。

如果检查失败，则会输出相应的错误信息。
