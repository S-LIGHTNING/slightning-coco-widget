---
sidebar_position: 1
---

# 导出控件

## exportWidget

```typescript
interface ExportConfig {
    decorators?: (Decorator | {
        CoCo?: Decorator | null | undefined
        CreationProject?: Decorator | null | undefined
    })[] | null | undefined
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
