import React from "react"
import { addCheck, addThisForMethods, CoCo, Color, CreationProject, exportWidget, getSuperWidget, StringEnumType, StringType, transformIcons, Types, Utils } from "slightning-coco-widget"

const types: Types = {
    type: "SLIGHTNING_WIDGET_LIVE_RELOAD_WIDGET",
    info: {
        title: "控件实时重载",
        icon: "https://creation.bcmcdn.com/716/appcraft/IMAGE_fLMaBYcwz_1748061454004.svg",
        category: "开发",
    },
    options: {
        visible: false,
        global: false
    },
    properties: [],
    methods: [
        {
            blockOptions: {
                color: Color.CYAN,
                icon: "https://creation.bcmcdn.com/716/appcraft/IMAGE_2uoB-Hqrvb_1748061454008.svg",
                inline: false
            },
            contents: [
                {
                    key: "start",
                    label: "启动",
                    block: [
                        {
                            key: "devServerURL",
                            label: "开发服务器地址",
                            type: new StringType({
                                defaultValue: "ws://localhost:8080/ws"
                            })
                        }, {
                            key: "widgetFileURL",
                            label: "控件文件地址",
                            type: new StringType({
                                defaultValue: "http://localhost:8080/widget.js"
                            })
                        }, {
                            key: "autoRestartWork",
                            label: "自动重启作品",
                            type: new StringEnumType({
                                entries: [
                                    { label: "总是", value: "always" },
                                    { label: "从不", value: "never" }
                                ]
                            })
                        }, {
                            key: "autoReopenWork",
                            label: "自动重新打开作品",
                            type: new StringEnumType({
                                entries: [
                                    { label: "当类型定义变化时", value: "whenTypesChanged" },
                                    { label: "总是", value: "always" },
                                    { label: "从不", value: "never" }
                                ]
                            })
                        }
                    ]
                }
            ]
        }
    ],
    events: []
}

declare global {
    interface Window {
        SLIGHTNING_WIDGET_LIVE_RELOAD: {
            startedSet: Set<string>
            widgetsCode: Record<string, string>
            widgetsTypes: Record<string, string>
            start: (
                devServerURL: string,
                widgetFileURL: string,
                autoRestartWork: "always" | "never",
                autoReopenWork: "whenTypesChanged" | "always" | "never"
            ) => void
        }
    }
}

if (Utils.inEditor() && window.SLIGHTNING_WIDGET_LIVE_RELOAD == null) {
    window.SLIGHTNING_WIDGET_LIVE_RELOAD = {
        startedSet: new Set(),
        widgetsCode: {},
        widgetsTypes: {},
        start(
            devServerURL: string,
            widgetFileURL: string,
            autoRestartWork: "always" | "never",
            autoReopenWork: "whenTypesChanged" | "always" | "never"
        ): void {
            if (window.SLIGHTNING_WIDGET_LIVE_RELOAD.startedSet.has(widgetFileURL)) {
                return
            }
            window.SLIGHTNING_WIDGET_LIVE_RELOAD.startedSet.add(widgetFileURL)
            const connection = new WebSocket(devServerURL)
            connection.addEventListener("open", function (): void {
                console.log("[自动导入控件] 开发服务连接已打开")
            })
            connection.addEventListener("message", async function (event: MessageEvent): Promise<void> {
                if (event.data == "{\"type\":\"ok\"}") {
                    try {
                        console.log(`[自动导入控件] 正在加载控件 ${widgetFileURL}`)
                        var widgetCode: string = await (await fetch(widgetFileURL)).text()
                        if (widgetCode == window.SLIGHTNING_WIDGET_LIVE_RELOAD.widgetsCode[widgetFileURL]) {
                            console.log(`[自动导入控件] 控件 ${widgetFileURL} 未发生变化`)
                            return
                        }
                        window.SLIGHTNING_WIDGET_LIVE_RELOAD.widgetsCode[widgetFileURL] = widgetCode
                        await Utils.editor.importWidget(widgetCode)
                        console.log(`[自动导入控件] 控件 ${widgetFileURL} 导入成功`)
                        if (autoReopenWork == "always") {
                            console.log("[自动导入控件] 正在重新打开作品")
                            await Utils.editor.saveWork()
                            Utils.editor.reopenWork()
                            return
                        } else if (autoReopenWork == "whenTypesChanged") {
                            const widgetExports: typeof CoCo.widgetExports | typeof CreationProject.widgetExports = {}
                            new Function(
                                "require",
                                "exports",
                                "InvisibleWidget",
                                "VisibleWidget",
                                "widgetClass",
                                "React",
                                widgetCode
                            )(
                                CoCo.widgetRequire,
                                widgetExports,
                                CoCo.InvisibleWidget,
                                CoCo.VisibleWidget,
                                CreationProject.widgetClass,
                                React
                            )
                            let widgetTypes: CoCo.Types | CreationProject.Types | null | undefined = null
                            if ("types" in widgetExports) {
                                widgetTypes = widgetExports.types
                            } else if ("type" in widgetExports) {
                                widgetTypes = widgetExports.type
                            }
                            const oldTypes: string | undefined = window.SLIGHTNING_WIDGET_LIVE_RELOAD.widgetsTypes[widgetFileURL]
                            const newTypes: string = JSON.stringify(widgetTypes, (__key: string, value: unknown): unknown => {
                                if (typeof value == "function") {
                                    return "(function)"
                                }
                                return value
                            })
                            if (oldTypes != null) {
                                if (oldTypes != newTypes) {
                                    console.log("[自动导入控件] 类型定义已变化，正在重新打开作品")
                                    await Utils.editor.saveWork()
                                    Utils.editor.reopenWork()
                                    window.SLIGHTNING_WIDGET_LIVE_RELOAD.widgetsTypes[widgetFileURL] = newTypes
                                    return
                                }
                            }
                            window.SLIGHTNING_WIDGET_LIVE_RELOAD.widgetsTypes[widgetFileURL] = newTypes
                        }
                        if (autoRestartWork == "always" && Utils.editor.isRunningWork()) {
                            Utils.editor.stopWork()
                            setTimeout((): void => {
                                Utils.editor.runWork()
                                console.log("[自动导入控件] 作品已自动重启")
                            }, 0)
                        }
                    } catch (error) {
                        console.error(`[自动导入控件] 自动导入控件 ${widgetFileURL} 失败`, error)
                    }
                }
            })
            connection.addEventListener("error", function (event: Event): void {
                console.error("[自动导入控件] 开发服务连接出错", event)
            })
            connection.addEventListener("close", function (event: CloseEvent): void {
                window.SLIGHTNING_WIDGET_LIVE_RELOAD.startedSet.delete(widgetFileURL)
                console.log("[自动导入控件] 开发服务连接已关闭", event)
            })
        }
    }
}

class WidgetLiveReloadWidget extends getSuperWidget(types) {

    constructor(props: object) {
        super(props)
    }

    public start(
        devServerURL: string,
        widgetFileURL: string,
        autoRestartWork: "always" | "never",
        autoReopenWork: "whenTypesChanged" | "always" | "never"
    ): void {
        const editorWindow: Window | null = Utils.editor.getWindow()
        if (editorWindow == null) {
            console.error("[自动导入控件] 无法获取编辑器窗口")
            return
        }
        editorWindow.SLIGHTNING_WIDGET_LIVE_RELOAD.start(devServerURL, widgetFileURL, autoRestartWork, autoReopenWork)
    }
}

exportWidget(types, WidgetLiveReloadWidget, {
    CoCo: {
        decorators: [
            addThisForMethods,
            addCheck
        ]
    },
    CreationProject: {
        decorators: [
            addThisForMethods,
            addCheck,
            transformIcons
        ]
    }
})
