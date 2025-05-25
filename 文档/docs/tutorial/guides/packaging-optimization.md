---
sidebar_position: 1
---

# 打包优化

:::caution 注意
在阅读本文档之前，我们假定你已经知道如何利用 SCW 打包 CoCo 控件，如果你还不了解，详见 [打包 CoCo 控件](/docs/tutorial/fast-start/pack)。
:::

:::tip 提示
本文档继续沿用 [打包 CoCo 控件](/docs/tutorial/fast-start/pack) 中的示例配置。
:::

## 优化打包速度

在开发过程中，可以使用监视模式来提升打包速度。监视模式下，webpack 只会编译发生变化的文件，而不会重新编译整个项目。

使用：

```sh
npx webpack --watch
```

## 优化打包大小

### 使用编辑器提供的库

CoCo 和 Creation Project 都提供了一些库，使用由编辑器提供的库而非将库打包到自定义控件中可以减少打包大小。

```js
// webpack.config.js

const { merge } = require("webpack-merge")
const SCW = require("slightning-coco-widget--webpack")

module.exports = module.exports = merge(SCW.config, {
    //...
    externals: {
        "crypto-js": "commonjs crypto-js",
        "axios": "commonjs axios",
        "@vikadata/vika": "commonjs @vikadata/vika",
        "lodash": "commonjs lodash",
        "html2canvas": "commonjs html2canvas"
    }
    //...
})
```

:::tip 提示
由于这些库可能存在版本兼容问题，SCW 没有默认排除这些库。
:::

## 优化开发体验

### 使用高质量的 Source Map

Source Map 是一个映射关系表，它将编译后的代码映射回源代码。通过 Source Map 可以方便地在浏览器中调试代码，定位错误。

在 webpack 配置文件中，可以通过 `devtool` 属性来指定 Source Map 的类型。

```js
// webpack.config.js

const { merge } = require("webpack-merge")
const SCW = require("slightning-coco-widget--webpack")

module.exports = module.exports = merge(SCW.config, {
    //...
    devtool: "eval-source-map",
    //...
})
```

:::tip 提示
更多关于 Source Map 的配置，请参考 [webpack 文档](https://webpack.js.org/configuration/devtool/)。
:::

:::caution 注意
由于 CoCo 自定义控件的特殊性，只有 `eval` 类的 Source Map 才会生效。其他类型的 Source Map 不会产生任何效果。
:::

:::caution 注意
在生产环境下，不要使用 Source Map，`eval` 函数的安全性和性能可能存在问题。
:::

:::caution 注意
高质量的 Source Map 可能导致打包速度变慢。
:::

### 实时重载（Live Reload）

实时重载可以在控件发生变化时，自动重新导入控件、重启作品、刷新编辑器。

#### 配置 webpack

安装 `webpack-dev-server` 依赖：

```sh
npm install webpack-dev-server --save-dev
```

在 webpack 配置文件中，通过 `devServer` 属性来配置实时重载。

```js
// webpack.config.js
const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const SCW = require("slightning-coco-widget--webpack")

module.exports = module.exports = merge(SCW.config, {
    //...
    devServer: {
        static: {
            directory: path.join(__dirname, "dist")
        },
        allowedHosts: [                // 允许 CoCo 和 Creation Project 编辑器访问。
            "coco.codemao.cn",
            "cp.cocotais.cn"
        ],
        headers(incomingMessage) {     // 允许跨域请求。
            /** @type {{ rawHeaders: string[] }} */
            const {rawHeaders} = incomingMessage
            const origin = rawHeaders[rawHeaders.findIndex((value) => {
                return /origin/i.test(value)
            }) + 1]
            return {
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET"
            }
        },
        hot: false,                    // 关闭 webpack 模块热替换，以避免冲突。
        liveReload: false              // 关闭 webpack 实时重载，以避免冲突。
    },
    //...
    plugins: [
        // ...
        new webpack.IgnorePlugin({     // 忽略 webpack-dev-server 相关资源，以避免冲突。
            resourceRegExp: /webpack-dev-server/,
        })
        // ...
    ]
    //...
})
```

启动 webpack 开发服务器：

```sh
npx webpack serve
```

之后你会看到如下输出：

```
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/, http://[::1]:8080/
<i> [webpack-dev-server] On Your Network (IPv4): http://172.27.16.1:8080/
<i> [webpack-dev-server] Content not from webpack is served from 'path/to/your/project/dist' directory
```

其中 `http://localhost:8080/` 是开发服务器的地址，你的地址可能与示例中的不同，请根据输出中的提示确定你的地址。打开这个地址，找到你的自定义控件，点击右键，点击「复制链接地址」。

#### 配置控件实时重载

控件实时重载是一个自定义控件，它可以在编辑器中实时重载自定义控件。

<p><a href="/slightning-coco-widget/download/控件实时重载.min.js" target="_blank" download="控件实时重载.min.js">点击下载控件实时重载控件</a></p>

将下载的控件导入到编辑器中，并添加到舞台上，调用 `启动`（在控件积木盒中）方法以启动实时重载，注意下开发服务地址的端口是否正确，控件文件地址填写为刚才复制的地址。

运行作品，使 `启动` 方法被调用后，实时重载就会生效。

:::tip 提示
如果实时重载已经启动，重复调用 `启动` 方法不会再次启动，所以无需移除调用 `启动` 方法的积木。
:::

:::tip 提示
你可以打开开发者工具，在「控制台」标签下，查看实时重载的日志。
:::

#### 关闭实时重载

方法一：关掉 webpack 开发服务器。在终端按 `Ctrl + C` 关闭 webpack 开发服务器。当与 webpack 开发服务器的连接断开时，实时重载会自动失效。

方法二：刷新编辑器。在编辑器中刷新页面，实时重载会自动失效。
