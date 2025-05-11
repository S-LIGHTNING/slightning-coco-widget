---
sidebar_position: 1
---

# 主体

## Types

### Types.type

类型：`string`

描述：全局唯一控件类型。

命名规范：仅由大写英文字母加下划线组成。

### Types.info

类型：`object`

描述：控件信息。

#### Types.info.title

类型：`string`

描述：控件名称。

会在编辑器显示。

#### Types.info.icon

类型：`string`

描述：控件图标链接。

控件图标会在编辑器显示。

一般使用 SVG。

#### Types.info.category?

类型：`string`

描述：控件分类。

**仅在 Creation Project 中生效，CoCo 不支持该特性。**

#### Types.info.version?

类型：`string`

描述：控件版本。

推荐使用语义化版本：https://semver.org/lang/zh-CN/。

#### Types.info.url?

类型：`object`

描述：控件链接。

##### Types.info.url.homepage?

类型：`string`

描述：控件主页链接。

##### Types.info.url.docs?

类型：`string`

描述：控件文档链接。

设置后可在控件属性面板下方点击“如何使用？”跳转到文档。

##### Types.info.url.repository?

类型：`string`

描述：控件代码仓库链接。

##### Types.info.url.bugReport?

类型：`string`

描述：控件问题报告链接。

### Types.options

类型：`object`

描述：控件选项。

#### Types.options.visible

类型：`boolean`

描述：是否是可见控件。

#### Types.options.global

类型：`boolean`

描述：是否是全局控件。

#### Types.options.static?

类型：`boolean`

描述：是否是静态控件。

**仅在 Creation Project 中生效，CoCo 不支持该特性。**

默认值：`false`

静态控件特性：

- 引入后会自动添加到作品内，不会显示在控件栏；
- 属性相关积木将不会添加“设置 [控件名]”或“获取 [控件名]”前缀；
- 事件积木 将不会添加“当 [控件名]”前缀。

#### Types.options.platforms?

类型：<code>[PlatformEnum](#platformenum)[]</code>

描述：控件的可用平台。

#### Types.options.any?

类型：`boolean`

描述：是否生成任意控件积木。

**仅在 CoCo 中生效，Creation Project 不支持该特性。**

默认值：`false`

### Types.properties

类型：<code>[PropertyGroup](./property#propertygroup)[] | [PropertyTypes](./property#propertytypes)[]</code>

描述：控件属性。

### Types.methods

类型：<code>[MethodGroup](./method#methodgroup)[] | [MethodTypes](./method#methodtypes)[]</code>

描述：控件方法。

### Types.events

类型：<code>[EventTypes](./event#eventtypes)[]</code>

描述：控件事件。

## Platforms

类型：<code>[PlatformEnum](#platformenum)[]</code>

描述：控件的可用平台。

## PlatformEnum

枚举类型：

- `WEB`：网页（编辑器、h5 预览、社区分享）。
- `ANDROID`：安卓手机端。
- `IOS`：iOS 端（iPhone，iPad 等）。
