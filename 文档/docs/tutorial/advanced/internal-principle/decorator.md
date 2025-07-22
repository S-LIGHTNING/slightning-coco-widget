---
sidebar_position: 2
---

# 装饰器

## 功能和实质

装饰器的功能是在导出控件前，对控件的类型定义和实体定义进行一些转换。

装饰器的实质是一个函数，它接收两个参数，分别是标准控件类型定义和控件实体定义，并以数组格式返回处理过的标准控件类型定义和控件实体定义。用类型语句描述如下：

```typescript
import { StandardTypes, Widget } from "slightning-coco-widget"
type Decorator = (types: StandardTypes, widget: Widget) => [StandardTypes, Widget]
```

标准控件类型定义是统一、非简洁且明确的，相较于普通的控件类型定义，它更加易于程序处理。

## 遍历和修改标准控件类型定义

在装饰器中遍历和修改标准控件类型定义是很常见的。SCW 提供了`traverseTypes`方法用于遍历和修改标准控件类型定义。`traverseTypes`用法类似于`@babel/traverse`。

示例：

```typescript
import { Types, standardizeTypes, traverseTypes, MethodGroupNode, MethodTypesNode } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_TRAVERSE_TYPES",
    info: {
        title: "遍历类型定义",
        icon: "icon-widget-radio",
        category: "SCW 示例",
    },
    options: {
        visible: false,
        global: false
    },
    properties: [],
    methods: [{
        label: "测试",
        blockOptions: {
            color: "#123456"
        },
        contents: [{
            key: "testMethod",
            label: "测试方法",
            block: [MethodBlockParam.METHOD]
        }]
    }],
    events: []
}

traverseTypes(standardizeTypes(types), {
    MethodGroup: {
        enter(node: MethodGroupNode): void {
            // 输出：enter 测试
            console.log("enter " + node.value.label)
        },
        enter(node: MethodGroupNode): void {
            // 输出：exit 测试
            console.log("exit " + node.value.label)
        }
    },
    MethodTypes(node: MethodTypesNode): void {

        // 输出：node.blockOptions.color: #123456
        console.log("node.blockOptions.color: " + node.blockOptions.color)

        // 输出：node.value.blockOptions.color: undefined
        console.log("node.value.blockOptions.color: " + node.value.blockOptions.color)

        node.remove()
        node.insertAfter({
            key: "anotherTestMethod",
            label: "另一个测试方法",
            block: [MethodBlockParam.METHOD]
        })
    }
})

// 所有输出如下：
// enter 测试
// node.blockOptions.color: #123456
// node.value.blockOptions.color: undefined
// exit 测试

// 处理后的类型定义如下：
// {
//     type: "SLIGHTNING_COCO_WIDGET_EXAMPLE_TRAVERSE_TYPES",
//     info: {
//         title: "遍历类型定义",
//         icon: "icon-widget-radio",
//         category: "SCW 示例",
//     },
//     options: {
//         visible: false,
//         global: false
//     },
//     properties: [],
//     methods: [{
//         label: "测试",
//         blockOptions: {
//             color: "#123456"
//         },
//         contents: [{
//             key: "anotherTestMethod",
//             label: "另一个测试方法",
//             block: [MethodBlockParam.METHOD]
//         }]
//     }],
//     events: []
// }
```

更多内容请参考 [遍历标准控件类型定义 API 文档](/docs/api/export/decorators.md#遍历标准控件类型定义)。
