import * as CreationProject2 from "../../creation-project-2"
import { convertToCreationProject2 } from "../convert/to-creation-project-2"
import { PropertiesTypes, StandardTypes, Types } from "../types"
import { Widget } from "../widget"
import { Adapter, LoggerAdapter } from "./adapter"
import { decorate, ExportConfig } from "../export"

function isEditorWindow(window: Window): boolean {
    return /^https:\/\/(test-)?cp\.cocotais\.cn\/(#|\?.*)?$/.test(window.location.href)
}

function getEditorWindow(): Window | null {
    if (isEditorWindow(window)) {
        return window
    }
    try {
        if (parent != window && isEditorWindow(parent)) {
            return parent
        }
    } catch (__ignore) {}
    try {
        if (opener instanceof Window && isEditorWindow(opener)) {
            return opener
        }
    } catch (__ignore) {}
    return null
}

function getEditorWorkName(): string | null {
    return getEditorRunButton()?.parentElement?.querySelector<HTMLInputElement>("input[type=\"text\"]")?.value ?? null
}

function getEditorRunButton(): HTMLElement | null {
    return Array.from(getEditorWindow()?.document.querySelectorAll("button") ?? []).find(
        (button: HTMLElement): boolean => /^[\s]*(运[\s]*行|停[\s]*止)[\s]*$/.test(button.textContent ?? "")
    ) ?? null
}

function editorIsRunningWork(): boolean {
    return /^[\s]*停[\s]*止[\s]*$/.test(getEditorRunButton()?.textContent ?? "")
}

export const CreationProject2Adapter: Adapter = {
    getSuperWidget(types: Types) {
        const propertiesSet: Set<string> = new Set()
        function addProperties(properties: PropertiesTypes): void {
            for (const property of properties) {
                if ("contents" in property) {
                    addProperties(property.contents)
                    continue
                }
                propertiesSet.add(Array.isArray(property) ? property[0] : property.key)
            }
        }
        addProperties(types.properties)
        return class extends CreationProject2.widgetClass {
            public constructor() {
                super()
                return new Proxy(this, {
                    defineProperty(target: CreationProject2.widgetClass, property: string | symbol, attributes: PropertyDescriptor): boolean {
                        if (typeof property == "string" && propertiesSet.has(property)) {
                            return Reflect.defineProperty(target.props, property, attributes)
                        }
                        return Reflect.defineProperty(target, property, attributes)
                    },
                    deleteProperty(target: CreationProject2.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.deleteProperty(target.props, p)
                        }
                        return Reflect.deleteProperty(target, p)
                    },
                    get(target: CreationProject2.widgetClass, p: string | symbol, receiver: any): any {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.get(target.props, p, receiver)
                        }
                        return Reflect.get(target, p, receiver)
                    },
                    getOwnPropertyDescriptor(target: CreationProject2.widgetClass, p: string | symbol): TypedPropertyDescriptor<any> | undefined {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.getOwnPropertyDescriptor(target.props, p)
                        }
                        return Reflect.getOwnPropertyDescriptor(target, p)
                    },
                    has(target: CreationProject2.widgetClass, p: string | symbol): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            return Reflect.has(target.props, p)
                        }
                        return Reflect.has(target, p)
                    },
                    ownKeys(target: CreationProject2.widgetClass): (string | symbol)[] {
                        return Reflect.ownKeys(target).concat(Reflect.ownKeys(target.props))
                    },
                    set(target: CreationProject2.widgetClass, p: string | symbol, newValue: any, receiver: any): boolean {
                        if (typeof p == "string" && propertiesSet.has(p)) {
                            if (types.options.visible) {
                                CreationProject2.widgetClass.prototype.setProp.call(receiver, p, newValue)
                                return true
                            } else {
                                return Reflect.set(target.props, p, newValue, receiver)
                            }
                        }
                        return Reflect.set(target, p, newValue, receiver)
                    }
                })
            }
        }
    },
    exportWidget(types: StandardTypes, widget: Widget, config?: ExportConfig | null | undefined): void {
        [types, widget] = decorate(types, widget, config, ["CreationProject", "CreationProject2"])
        CreationProject2.exportWidget(...convertToCreationProject2(types, widget))
    },
    Logger: class CreationProjectLogger implements LoggerAdapter {

        private readonly widget: any

        public constructor(__types: Types, widget: any) {
            this.widget = widget
        }

        public log(messages: string): void {
            CreationProject2.widgetClass.prototype.widgetLog.call(this.widget, messages)
        }

        public info(messages: string): void {
            CreationProject2.widgetClass.prototype.widgetLog.call(this.widget, `[信息] ${messages}`)
        }

        public warn(messages: string): void {
            CreationProject2.widgetClass.prototype.widgetWarn.call(this.widget, messages)
        }

        public error(messages: string): void {
            CreationProject2.widgetClass.prototype.widgetError.call(this.widget, messages)
        }
    },
    emit(this: any, key: string, ...args: unknown[]): void {
        CreationProject2.widgetClass.prototype.emit.call(this, key, ...args)
    },
    utils: {
        inNative(): boolean {
            return location.protocol == "file:"
        },
        inEditor(): boolean {
            return isEditorWindow(window)
        },
        inEditorWindow: function (): boolean {
            return /^https:\/\/(test-)?cp\.cocotais\.cn\/(pptui)?$/.test(location.href)
        },
        inEditorPlayer: function (): boolean {
            return /^https:\/\/(test-)?cp\.cocotais\.cn\/player(#|\?.*)?$/.test(location.href)
        },
        getImageURLByFileName(__fileName: string): string | null {
            return null
        },
        getAudioURLByFileName(__fileName: string): string | null {
            return null
        },
        getVideoURLByFileName(__fileName: string): string | null {
            return null
        },
        editor: {
            getWindow: getEditorWindow,
            getWorkName: getEditorWorkName,
            getRunButton: getEditorRunButton,
            isRunningWork: editorIsRunningWork,
            runWork(): void {
                if (!editorIsRunningWork()) {
                    getEditorRunButton()?.click()
                }
            },
            stopWork(): void {
                if (editorIsRunningWork()) {
                    getEditorRunButton()?.click()
                }
            },
            saveWork(): Promise<void> {
                return new Promise((
                    resolve: (value: void) => void,
                    reject: (reason: Error) => void
                ): void => {
                    const editorWindow: Window | null = getEditorWindow()
                    if (editorWindow == null) {
                        reject(new Error("找不到编辑器窗口"))
                        return
                    }
                    const saveButton: HTMLElement | undefined = Array.from(editorWindow.document.querySelectorAll("button") ?? []).find(
                        (button: HTMLElement): boolean => /^[\s]*保[\s]*存[\s]*$/.test(button.textContent ?? "")
                    )
                    if (saveButton == null) {
                        reject(new Error("找不到保存按钮"))
                        return
                    }
                    saveButton.click()
                    const handle: ReturnType<typeof setInterval> = setInterval((): void => {
                        if (saveButton.children.length == 1) {
                            resolve()
                            clearInterval(handle)
                        }
                    }, 100)
                })
            },
            reopenWork(): void {
                const workName: string | null = getEditorWorkName()
                if (workName == null) {
                    throw new Error("找不到作品名称")
                }
                const editorWindow: Window | null = getEditorWindow()
                if (editorWindow == null) {
                    throw new Error("找不到编辑器窗口")
                }
                const openButton: HTMLElement | null = editorWindow.document.querySelector<HTMLElement>("[data-menu-id=\"open_cloud\"]")
                if (openButton == null) {
                    throw new Error("找不到打开按钮")
                }
                openButton.click()
                const handle: ReturnType<typeof setInterval> = setInterval((): void => {
                    const worksElement: HTMLElement[] = Array.from(editorWindow.document.querySelectorAll(".ant-card") ?? [])
                    const workElements: HTMLElement | undefined = worksElement.find(
                        (element: HTMLElement): boolean => element.querySelector(".ant-card-meta-title")?.textContent == workName
                    )
                    if (workElements != null) {
                        workElements.click()
                        clearInterval(handle)
                    }
                }, 100)
            },
            importWidget(widget: File | Blob | string): Promise<void> {
                return new Promise((
                    resolve: (value: void) => void,
                    reject: (reason: Error) => void
                ): void => {
                    if (typeof widget == "string") {
                        widget = new Blob([widget], { type: "text/javascript" })
                    }
                    if (widget instanceof Blob) {
                        widget = new File([widget], "widget.js", { type: "text/javascript" })
                    }
                    if (!(widget instanceof File)) {
                        reject(new Error("参数错误，widget 必须是 File 或 Blob 或字符串"))
                        return
                    }
                    const widgetFile: File = widget
                    const editorWindow: Window | null = getEditorWindow()
                    if (editorWindow == null) {
                        throw new Error("找不到编辑器窗口")
                    }
                    const importButton: HTMLElement | null = editorWindow.document.querySelector<HTMLElement>("[data-menu-id=\"import_extension\"]")
                    if (importButton == null) {
                        reject(new Error("找不到自定义控件导入按钮"))
                        return
                    }
                    const originalCreateElement: typeof document.createElement = editorWindow.document.createElement
                    editorWindow.document.createElement = function createElement(
                        tagName: string,
                        options?: ElementCreationOptions
                    ): HTMLElement {
                        const element: HTMLElement = originalCreateElement.call(this, tagName, options)
                        if (element instanceof HTMLInputElement) {
                            element.addEventListener("click", (event: MouseEvent): void => {
                                event.preventDefault()
                            })
                            editorWindow.document.createElement = originalCreateElement
                            setTimeout((): void => {
                                const dataTransfer = new DataTransfer()
                                dataTransfer.items.add(widgetFile)
                                element.files = dataTransfer.files
                                element.dispatchEvent(new Event("change", { bubbles: true }))
                                setTimeout((): void => {
                                    resolve()
                                }, 150)
                            }, 0)
                        }
                        return element
                    }
                    importButton.click()
                })
            },
        }
    }
}
