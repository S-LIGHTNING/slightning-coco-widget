---
sidebar_position: 1
---

# 针对 SCW

## 构建期转换

:::caution 注意
该功能是实验性功能，可能以次版本号发布破坏性更新，要使用该功能，请将 SCW 锁定到次版本号。
:::

:::caution 注意
该功能且需要 SCW 与 SCW webpack 相关工具配合使用，请注意安装对应版本的 NPM 包。
:::

SCW 与 SCW webpack 相关工具版本对应表：

| SCW 版本 | SCW webpack 相关工具版本 |
| :-: | :-: |
| ^2.9.0 | ^2.5.0 |

构建期转换是指通过在构建控件时将控件部分或全部的代码转换成原生代码。该方法可以避免将转换方法打包进控件中，从而减小最终生成文件的体积。

只需把 `webpack` 命令替换为 `scw-build [platform]` 即可使用启用构建期转换功能。其中 `platform` 参数可以是 `CoCo`、`CreationProject1`、`CreationProject2`，部分功能尚不完善，可能存在较多问题。
