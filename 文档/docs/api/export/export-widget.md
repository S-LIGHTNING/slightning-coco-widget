---
sidebar_position: 1
---

# 导出控件

## exportWidget

```typescript
type Platforms =
    "CoCo" |
    "CreationProject" |
    "Node" |
    "CoCo|CreationProject" |
    "CoCo|NodeJS" |
    "CreationProject|NodeJS" |
    "CoCo|CreationProject|NodeJS"

export interface ExportConfig {
    decorators?: (
        Decorator |
        Partial<Record<Platforms, Decorator | Decorator[] | null | undefined>>
    )[] | null | undefined
    CoCo?: {
        decorators?: Decorator[] | null | undefined
    } | null | undefined
    CreationProject?: {
        decorators?: Decorator[] | null | undefined
    } | null | undefined
}

declare function exportWidget(
    types: Types,
    widget: Widget,
    config?: ExportConfig | null | undefined
): void
```

| 参数 | 说明 |
| --- | --- |
| types | 类型定义 |
| widget | 控件定义 |
| config | 导出配置 |

导出配置

| 属性 | 说明 |
| --- | --- |
| decorators | 装饰器列表 |
| CoCo | CoCo 导出配置 |
| CoCo.decorators | CoCo 平台的装饰器列表 |
| CreationProject | Creation Project 导出配置 |
| CreationProject.decorators | Creation Project 平台的装饰器列表 |

2.3 版本新增：

| 属性 | 说明 |
| --- | --- |
| decorators[number].CoCo | CoCo 平台的装饰器 |
| decorators[number].CreationProject | Creation Project 平台的装饰器 |

2.5 版本新增：

| 属性 | 说明 |
| --- | --- |
| decorators[number].CoCo | CoCo 平台的装饰器列表 |
| decorators[number].CreationProject | Creation Project 平台的装饰器列表 |
| decorators[number].NodeJS | Node.js 平台的装饰器或其列表 |
| decorators[number]["CoCo\|CreationProject\" \| ...] | 多个平台的装饰器或其列表 |
