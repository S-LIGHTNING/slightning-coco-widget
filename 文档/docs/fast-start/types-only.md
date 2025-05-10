---
sidebar_position: 2
---

# 使用 Types

:::tip 提示
SCW 为 CoCo 自定义控件编写了 Types，使得 TypeScript 编译器可以更好地工作。
:::

## 一、安装

安装 SCW 和 TypeScript 编译器，在自定义控件目录中执行：

```sh
npm install slightning-coco-widget@2.0.1-alpha tsc --save-dev
```

## 二、启用类型检查

我们假定你有一个使用 JavaScript 编写的自定义控件，并将其放在了 `src` 目录下。

首先创建 TypeScript 配置文件。在项目根目录下创建一个名为 `tsconfig.json` 的文件，并添加以下内容：

```json
{
    "compilerOptions": {
        "outDir": "dist",              // 编译输出目录
        "target": "ESNext",            // 编译目标 JavaScript 版本，这里设置为 ESNext，以关闭 TypeScript 兼容性转义，防止出现一些奇奇怪怪的问题
        "module": "preserve",          // 保留模块导入方式，防止 TypeScript 将 CoCo 导入和导出转为其他形式
        "jsx": "react",                // JSX 转为 React
        "lib": ["ESNext", "DOM"],      // 使用 JS 和浏览器 API
        "skipLibCheck": true           // 跳过对依赖库的检查
    },
    "include": ["src/*"]
}

```

接下来为控件类型定义添加类型批注。

例如，假如控件的定义为：

```javascript
const types = {
    type: "MY_WIDGET",
    title: "我的控件",
    icon: "icon-widget-radio",
    isInvisibleWidget: true,
    isGlobalWidget: false,
    properties: [],
    methods: [],
    events: []
}

class MyWidget extends InvisibleWidget {
    // ...
}

exports.types = types
exports.widget = MyWidget
```

则应将其修改为：

```typescript
// 导入 CoCo 相关的类型定义
import type { CoCo } from "slightning-coco-widget"

// 为控件类型定义添加类型批注
const types: CoCo.Types = {
    type: "MY_WIDGET",
    title: "我的控件",
    icon: "icon-widget-radio",
    isInvisibleWidget: true,
    isGlobalWidget: false,
    properties: [],
    methods: [],
    events: []
}

// 为控件实体定义添加类型批注，这里以不可见控件为例。如果是可见控件，只需将`InvisibleWidget`改为`VisibleWidget`
declare const InvisibleWidget: typeof CoCo.InvisibleWidget
class MyWidget extends InvisibleWidget {
    // ...
}

exports.types = types
exports.widget = MyWidget
```

## 三、编译

使用 tsc 将 TypeScript 代码转为 JS 代码。

在自定义控件目录中执行：

```sh
tsc
```

然后，在原控件目录内，会生成一个同名的 JS 文件。
