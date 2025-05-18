---
sidebar_position: 1
---

# 打包优化

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
