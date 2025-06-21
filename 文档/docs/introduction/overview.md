---
sidebar_position: 1
---

# 概述

## 一、简介

SLIGHTNING CoCo 控件框架（SLIGHTNING CoCo Widget，简称“SCW”）是由 [@SLIGHTNING](https://s-lightning.github.io/) 开发的 CoCo 自定义控件框架，旨在解决 [@SLIGHTNING](https://s-lightning.github.io/) 在开发 CoCo 控件时所遇到的一些问题。

## 二、功能

- 更强大的功能，例如：
  - 将函数作为参数传递，并转化为合适的形式（如：事件、Creation Project 回调积木块）；
  - 对方法分组，对一组方法统一设置积木选项，SCW 会根据分组自动生成标签、调整积木间距。
- 数据类型验证、错误提示（防止 CoCo 编辑器吞错误）。
- 自动绕过 CoCo 对自定义控件的限制。
- TypeScript 支持。
- 可以转化为 Creation Project 控件并利用 Creation Project 的一些牛叉小特性。

## 三、缺陷

详见[劝退指南](dissuade)。

## 四、设计原则

SCW 优先考虑工程需求，其次考虑简洁、易用。具体原则如下：

- 可读性优先：SCW 优先考虑代码的可读性而不是简洁；
- 高兼容性：SCW 尽可能避免破坏性的更新，在出现破坏性更新时，SCW 会提供向下兼容的方案和升级指南；
- 易于扩展：SCW 的 API 应易于扩展，以便在添加新功能时不破坏已有功能；
- 不预设功能：SCW 不会预设任何功能，所有功能都需要手动添加，以便让用户知道 SCW 做了什么，这也避免了预设功能的变更带来的影响。

此外，SCW 的绝大多数功能要经过严格测试后才会在正式版本中发布，以保证其稳定性和正确性。

以上原则注定了 SCW 的一些缺陷，例如：

- 学习成本高；
- 代码不够简洁；
- 历史包袱过重；
- 新功能发布速度慢。

## 五、许可

SCW 代码遵循 [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0.html)。

SCW 文档遵循 [署名—非商业性使用 4.0 协议国际版](https://creativecommons.org/licenses/by-nc/4.0/legalcode.zh-hans)。
