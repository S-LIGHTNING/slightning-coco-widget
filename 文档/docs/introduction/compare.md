---
sidebar_position: 3
---

# 比较

本文档将对以下原生开发、框架或工具进行比较：

- [`CoCo`](https://coco.codemao.cn/home) 原生：CoCo 是由 [@编程猫](https://www.codemao.cn/) 开发的编辑器；
- [`Creation Project`](https://cp.cocotais.cn/) 原生：Creation Project 是由 [@Cocotais Team](https://cocotais.cn/) 开发的编辑器；
- [`SCW`](/)：由 [@SLIGHTNING](https://s-lightning.github.io/) 开发的框架；
- [`CoCoKit`](https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/uya7g9piiu5mcy28)：由 @琦琦 开发的框架；
- [`魔盒CoCo框架`](https://xjwangdage.feishu.cn/wiki/BpBswys7Ci65mQkqxMXc8tWDnXb)：由 @XJ王大哥 开发的框架；
- [`cdef`](https://github.com/liulyxandy-codemao/cdef)：由 [@刘andy](https://gitee.com/liulyxandy) 编写的 CoCo 自定义控件类型定义；
- CoCo Widget Live Server：由 @Inventocode 开发的工具，暂不清楚具体功能。

如果想添加其他框架或工具，请联系 [SLIGHTNING](https://s-lightning.github.io/)。

## 基础语法

### 控件类型定义

| 原生开发、框架或工具 | 形式 | 简便性 | 嵌入实体函数 |
| :-: | :-: | :-: | :-: |
| CoCo 原生 | 对象 | ❌ 复杂 | ❌ |
| Creation Project 原生 | 对象 | ❌ 复杂 | ✅ |
| **SCW** | 对象 | ❌ 复杂 | ❌ |
| CoCoKit | 连缀函数 | ✅ 简单 | ✅ |
| 魔盒CoCo框架 | 对象 | ✅ 较简单 | ✅ |

### 控件实体定义

| 原生开发、框架或工具 | 形式 |
| :-: | :-: |
| CoCo 原生 | 类 |
| Creation Project 原生 | 类 |
| **SCW** | 类 |
| CoCoKit | 嵌在类型定义中 |
| 魔盒CoCo框架 | 未知 |

## 功能

| 原生开发、框架或工具 | 模块化 | 使用第三方库 | 函数一等公民 | 方法分组 | 复杂控件日志 | 自动绕过 CoCo 限制 | Creation Project 功能支持 |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| CoCo 原生 | ❌ | ❌ 仅可用内置的库，其他库需要手动加载 | ❌（完全不支持） | ❌ | ❌（仅支持字符串） | ❌ | ❌ |
| Creation Project 原生 | ❌ | ❌ 仅可用内置的库，其他库需要手动加载 | ❌（仅支持无返回值的回调函数） | ❌ | ❌（仅支持字符串） | ❌ | ✅ |
| **SCW** | ✅ | ✅ 可使用所有能在浏览器中运行的库 | ✅（支持较为完善） | ✅ | ✅ | ✅ | ✅（部分支持） |
| CoCoKit | ✅ | ✅ 可使用所有能在浏览器中运行的库 | ❌ | ❌（未来可能支持） | ❌（仅支持字符串） | ❌ | ❌ |
| 魔盒CoCo框架 | 未知 | 未知 | ❌ | ✅ | 未知 | 未知 | ❌ |

## 开发体验

### 刷新控件

| 原生开发、框架或工具 | 实时生成控件 | 自动导入控件 | 导入后刷新 | 模块热更新 |
| :-: | :-: | :-: | :-: | :-: |
| CoCo 原生 | ✅（无需生成） | ❌ | ❌（需要手动刷新编辑器） | ❌ |
| Creation Project 原生 | ✅（无需生成） | ❌ | ✅（无需刷新） | ❌ |
| **SCW** | ✅（通过 webpack 实时编译） | ❌ | ❌ | ❌ |
| CoCoKit | ✅（通过 webpack 实时编译） | ❌ | ❌ | ❌ |
| 魔盒CoCo框架 | 未知 | 未知 | 未知 | 未知 |
| CoCo Widget Live Server | | 未知 | 未知 | 未知 |

### 错误提示

| 原生开发、框架或工具 | 编辑器控制台报错 | 浏览器控制台报错 | 提供堆栈信息 |
| :-: | :-: | :-: | :-: |
| CoCo 原生 | ❌ | ✅ | ❌ |
| Creation Project 原生 | ❌ | ✅ | ❌ |
| **SCW** | ✅（通过 `addCheck` 装饰器） | ✅ | ✅（通过 webpack devtool） |
| CoCoKit | ❌ | ✅ | ❌ |
| 魔盒CoCo框架 | 未知 | 未知 | 未知 |

### TypeScript 支持

| 原生开发、框架或工具 | TypeScript 支持 |
| :-: | :-: |
| CoCo 原生 | ❌ |
| Creation Project 原生 | ✅（通过文档提供类型定义） |
| **SCW** | ✅（包含 CoCo 和 Creation Project 原生控件的类型定义） |
| CoCoKit | ✅ |
| 魔盒CoCo框架 | 未知 |
| cdef | ✅（仅支持 CoCo） |

## 学习成本

| 原生开发、框架或工具 | 学习成本 |
| :-: | :-: |
| CoCo 原生 | ✅ 非常低 |
| Creation Project 原生 | ✅ 非常低 |
| **SCW** | ❌ 非常高（API 复杂；需要手动配置 webpack） |
| CoCoKit | ✅ 一般（提供 CLI 工具自动配置，可能需要手动配置） |
| 魔盒CoCo框架 | 未知 |
| cdef | ✅ 较低 |
| CoCo Widget Live Server | 未知 |
