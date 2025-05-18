---
sidebar_position: 4
---

# 使用 SCW

:::caution 注意
在阅读本文档之前，我们假定你已经知道如何利用 SCW 打包 CoCo 控件，如果你还不了解，详见 [打包 CoCo 控件](pack)。
:::

## 一、控件类型定义

```typescript
const types: Types = {
    type: "MY_WIDGET",
    info: {
        title: "我的控件",
        icon: "icon-widget-radio",
        category: "我的控件"
    },
    options: {
        visible: false,
        global: true
    },
    properties: [/* 控件属性 */],
    methods: [/* 控件方法 */],
    events: [/* 控件事件 */]
}
```

| 属性 | 说明 |
| --- | --- |
| type | 控件类型，全局唯一，命名规范：大写字母加下划线组成 |
| info | 控件信息，包括名称、图标、分类等，详见 [API](../api/types/main#typesinfo) |
| info.title | 控件名称 |
| info.icon | 控件图标 |
| info.category | 控件分类 |
| options | 控件选项，包括是否可见、是否全局等，详见 [API](../api/types/main#typesoptions) |
| options.visible | 是否可见，默认 false |
| options.global | 是否全局，默认 false |
| properties | 控件属性，包括控件的属性、类型、默认值等 |
| methods | 控件方法，包括控件的行为、参数等 |
| events | 控件事件，包括控件的触发事件、参数等 |

### 1.控件属性

```typescript
const types: Types = {
    //...
    properties: [
        {
            key: "property",
            label: "属性",
            type: new StringType({
                defaultValue: "默认值"
            }),
            blockOptions: {
                get: {
                    key: "getProperty"
                },
                set: false
            }
        }
    ]
}
```

| 属性 | 说明 |
| --- | --- |
| key | 控件的属性，命名规范：英文 + 数字组成，不能以数字开头，可以使用 CoCo 内置属性 |
| label | 属性的显示名称 |
| type | 属性的类型，详见 [类型 API](../api/types/type) |
| blockOptions | 属性的积木块选项，详见 [属性积木块选项 API](../api/types/property#propertytypesblockoptions) |
| blockOptions.get | 属性的获取方法积木选项，false 表示不可获取 |
| blockOptions.get.key | 获取方法名 |
| blockOptions.set | 属性的设置方法积木选项，false 表示不可设置 |
| blockOptions.set.key | 设置方法名 |

控件属性组

```typescript
const types: Types = {
    //...
    properties: [
        {
            blockOptions: {
                set: false
            },
            contents: [
                {
                    key: "property1",
                    label: "属性1",
                    type: new StringType({
                        defaultValue: "默认值"
                    })
                }, {
                    key: "property2",
                    label: "属性2",
                    type: new StringType({
                        defaultValue: "默认值"
                    })
                }
            ]
        }
    ]
}
```

| 属性 | 说明 |
| --- | --- |
| blockOptions | 属性组的积木块选项，属性组内的每个属性都继承了此选项 |
| contents | 属性组的内容 |

:::tip 提示

属性组是可以嵌套的。例如：

```typescript
const types: Types = {
    //...
    properties: [
        {
            blockOptions: {/* 属性组的积木块选项 */},
            contents: [
                {                      // 子属性组
                    blockOptions: {/* 子属性组的积木块选项，继承自父属性组的积木块选项 */},
                    contents: [
                        {
                            key: "property",
                            label: "属性",
                            type: new StringType({
                                defaultValue: "默认值"
                            })
                        }
                    ]
                }
            ]
        }
    ]
}
```

:::

### 2.控件方法

```typescript
const types: Types = {
    //...
    methods: [
        {
            key: "method",
            label: "方法",
            block: [
                "调用", MethodBlockParam.THIS, MethodBlockParam.METHOD, "参数1", {
                    key: "param1",
                    label: "参数1",
                    type: new StringType({
                        defaultValue: "默认值"
                    })
                }, "参数2", {
                    key: "param2",
                    label: "参数2",
                    type: new NumberType({
                        defaultValue: 0
                    })
                }
            ],
            returns: new StringType(),
            blockOptions: {
                icon: "icon-widget-radio",
                color: Color.BLUE,
            }
        }
    ]
}
```

生成的积木块：`(调用 [我的控件] 方法 [方法] 参数1 (“默认值”) 参数2 (0))`

| 属性 | 说明 |
| --- | --- |
| key | 控件的方法，命名规范：英文 + 数字组成，不能以数字开头 |
| label | 方法标签 |
| block | 方法的积木 |
| returns | 方法的返回值类型，详见 [方法返回 API](../api/types/method#methodtypesreturns) |
| blockOptions | 方法的积木块选项，详见 [方法积木块选项 API](../api/types/method#methodtypesblockoptions) |

方法组

```typescript
const types: Types = {
    //...
    methods: [
        {
            label: "方法组",
            blockOptions: {
                color: Color.BLUE
            },
            contents: [
                {
                    key: "method1",
                    label: "方法1",
                    block: ["调用", MethodBlockParam.THIS, MethodBlockParam.METHOD]
                }, {
                    key: "method2",
                    label: "方法2",
                    block: ["调用", MethodBlockParam.THIS, MethodBlockParam.METHOD]
                }
            ]
        }
    ]
}
```

生成的积木：

```
· 方法组 --------
[调用 [我的控件] 方法1)
[调用 [我的控件] 方法2)
```

| 属性 | 说明 |
| --- | --- |
| label | 方法组标签，可选，设置后会在积木块上显示 |
| blockOptions | 方法组的积木块选项，方法组内的每个方法都继承了此选项 |
| contents | 方法组的内容 |

:::tip 提示
同属性组一样，方法组也是可以嵌套的。
:::

### 3.控件事件

```typescript
const types: Types = {
    //...
    events: [
        {
            key: "event",
            label: "事件",
            params: [
                {
                    key: "param1",
                    label: "参数1",
                    type: new StringType()
                }, {
                    key: "param2",
                    label: "参数2",
                    type: new NumberType()
                }
            ]
        }
    ]
}
```

| 属性 | 说明 |
| --- | --- |
| key | 事件名，全局唯一，命名规范：英文 + 数字组成，不能以数字开头 |
| label | 事件标签 |
| params | 事件的参数列表 |

## 二、控件实体定义

### 1.控件实体类

```typescript
class MyWidget extends getSuperWidget(types) {

    public constructor(props: object) {
        super(props)
    }

    public method(param1: string, param2: number): string {
        return "返回值"
    }

    public getProperty(): string {
        return this.property
    }
}
```

### 2.控件实体属性

可以直接操作`this.property`来设置和获取控件的属性，无论是可见控件还是不可见控件，都可以直接操作，不需要使用`setProps`方法。

:::caution 注意
内置属性不能在控件中访问。
:::

```typescript
class MyWidget extends getSuperWidget(types) {

    public property!: string

    public constructor(props: object) {
        super(props)
    }

    public method(param1: string, param2: number): string {
        return this.property = param1 + param2.toString()
    }

    // ...
}
```

### 3.触发事件

```typescript
class MyWidget extends getSuperWidget(types) {

    public constructor(props: object) {
        super(props)
        emit.call(this, "event", "参数1", 2)
    }

    // ...
}
```

### 4.输出日志

使用`Logger`输出日志，`Logger`会同时将日志输出到编辑器控制台和浏览器控制台，`Logger`支持输出复杂对象，就像`console.log`一样。

```typescript
class MyWidget extends getSuperWidget(types) {

    public logger: Logger

    public constructor(props: object) {
        super(props)
        this.logger = new Logger(types, this)
        this.logger.log("控件构造完成", this)
    }

    // ...
}
```

## 三、导出控件

```typescript
exportWidget(types, MtWidget, {
    decorators: [
        generateMethodForFunctions,
        generateBlockForProperties,
        transformMethodsThrows
    ],
    CoCo: {
        decorators: [
            transformMethodsCallbackFunctionsToEvents,
            addThisForMethods,
            addCheck,
            transformIconsExceptWidgetIcon
        ]
    },
    CreationProject: {
        decorators: [
            flattenEventSubTypes,
            transformMethodsCallbackFunctionsToCodeBlocks,
            addThisForMethods,
            addCheck,
            transformIcons
        ]
    }
})
```

| 属性 | 说明 |
| --- | --- |
| decorators | 装饰器列表 |
| CoCo | CoCo 导出配置 |
| CoCo.decorators | CoCo 项目装饰器列表 |
| CreationProject | Creation Project 导出配置 |
| CreationProject.decorators | Creation Project 装饰器列表 |

:::tip 提示
有关于装饰器的更多信息详见 [导出装饰器 API](../api/export/decorators)。
:::
