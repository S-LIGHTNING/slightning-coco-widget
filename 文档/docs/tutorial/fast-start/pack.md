---
sidebar_position: 3
---

# 打包 CoCo 控件

:::tip 提示
SCW 使用 webpack 打包控件，你可以按照如下流程打包你的自定义控件。
:::

:::tip 提示
SCW webpack 相关工具与 SCW 是独立的，也就是说，使用 SCW webpack 相关工具不必须使用 SCW，原生自定义控件和使用其他框架的自定义控件也可以使用 SCW 提供的 webpack 工具。
:::

## 基本流程

### 一、安装

安装 SCW 和 webpack，在自定义控件目录中执行：

```sh
npm install slightning-coco-widget slightning-coco-widget--webpack webpack webpack-cli webpack-merge --save-dev
```

如果你使用 TypeScript，还需要安装 ts-loader：

```sh
npm install ts-loader --save-dev
```

### 二、配置 webpack

在项目根目录下创建 `webpack.config.js` 文件，并配置 webpack。以下是示例配置：

```javascript
// webpack.config.js

const path = require("path")
const { merge } = require("webpack-merge")
const SCW = require("slightning-coco-widget--webpack")

module.exports = merge(SCW.config, {   // 合并 SCW 配置。
    mode: "development",               // 开发模式，在开发阶段建议使用，生产模式请改为 "production"。
    stats: "minimal",                  // 在控制台输出更少的日志。
    entry: "./path-to-you-widget.ts",  // 入口文件，请替换为你的自定义控件路径。
    devtool: "eval-source-map",        // 生成 source map，方便调试。
    output: {                          // 输出配置。
        path: path.resolve(__dirname, "dist"),                 // 输出目录。
        filename: "output-widget.js"   // 输出文件名。
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: "ts-loader"       // 使用 ts-loader 编译 TypeScript 文件，如果使用 JavaScript 则不需要。
            }
        ]
    },
    resolve: {                         // 解析配置。
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    }
})
```

你可能想知道 SCW.config 配置了哪些内容。以下是 SCW 配置的内容：

```javascript
const SCW = require("slightning-coco-widget--webpack")

module.exports = {
    output: {
        library: {                     // 导出配置。
            type: "commonjs"
        }
    },
    module: {
        rules: [
            {                          // 绕过 CoCo 自定义控件的限制。
                test: /\.(j|t)sx?$/,
                use: "slightning-coco-widget--webpack/loader/bypass-restrictions-loader",
            }
        ]
    },
    externals: {                       // 外部依赖配置。
        react: "var React"             // 使用 CoCo 提供的 React，避免将 React 打包进自定义控件。
    },
    plugins: [
        new SCW.WrapperPlugin()        // 控件包装插件，用于包装控件，以绕过一些限制，并防止 CoCo 吞错误信息。
    ]
}
```

### 三、编译

在自定义控件目录中执行：

```sh
npx webpack
```

编译完成后，会在 dist 目录下生成 output-widget.js 文件，该文件就是打包后的自定义控件。如果你修改了输出文件名，生成的文件名也会相应改变。

你可以使用 watch 模式，实时编译：

```sh
npx webpack --watch
```

### 四、发布

修改 webpack 配置中的 `mode` 为 `production`，`devtool` 为 `false`，并执行：

```sh
npx webpack
```

## 进阶用法

### 使用 JSX

Webpack 默认无法解析 JSX，要使用 JSX，需要进行一些预处理。

如果你使用 TypeScript, 可以使用 ts-loader 转换 TSX，只需在 TypeScript 文件中添加 JSX 配置。

```json
// tsconfig

{
    "compilerOptions": {
        // ...
        "jsx": "react",
        //...
    },
    // ...
}
```

如果你不使用 TypeScript，则需要用 Babel 来处理 JSX。

安装依赖：

```sh
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

配置 webpack：

```javascript
// webpack.config.js

const path = require("path")
const { merge } = require("webpack-merge")
const SCW = require("slightning-coco-widget--webpack")

module.exports = merge(SCW.config, {
    // ...
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react"]
                    }
                }
            }
        ]
    }
    // ...
})
```

### 分离配置

由于开发环境和生产环境配置有较大差异，建议开发环境和生产环境的配置分开。

删除 `webpack.config.js`，并添加以下文件：

```javascript
// webpack.common.js

const path = require("path")
const { merge } = require("webpack-merge")
const SCW = require("slightning-coco-widget--webpack")

module.exports = merge(SCW.config, {
    stats: "minimal",
    entry: "./path-to-you-widget.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "output-widget.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    }
})
```

```javascript
// webpack.dev.js

const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map"
})
```

```javascript
// webpack.prod.js

const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
    mode: "production",
    devtool: false
})
```

在开发环境下，使用 `npx webpack --config webpack.dev.js` 命令打包；在生产环境下，使用 `npx webpack --config webpack.prod.js` 命令打包。

### 使用 NPM Scripts

可以把打包命令添加到 `package.json` 的 `scripts` 字段中，以方便使用：

```json
// package.json

{
  // ...
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "watch": "webpack --watch --config webpack.dev.js"
  }
}
```

配置好后，就可以使用 `npm run build` 和 `npm run watch` 来进行打包。
