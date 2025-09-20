import * as CreationProject1 from "../../creation-project-1"
import { Adapter } from "./adapter"
import type { crossPlatform } from "../runtime/cross-platform"

function isEditorWindow(window: Window): boolean {
    return /^https:\/\/cp\.cocotais\.cn\/(#|\?.*)?$/.test(window.location.href)
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

/**
 * @deprecated 适配器模式已弃用，请使用 {@link crossPlatform} 替代。
 */
export const CreationProject1Adapter: Adapter = {
    utils: {
        inNative(): boolean {
            return CreationProject1.widgetRequire("cp_utils")?.native ?? false
        },
        inEditor(): boolean {
            return !(CreationProject1.widgetRequire("cp_utils")?.player ?? true)
        },
        inEditorWindow: function (): boolean {
            return /^https:\/\/cp\.cocotais\.cn\/(pptui)?$/.test(location.href)
        },
        inEditorPlayer: function (): boolean {
            return /^https:\/\/cp\.cocotais\.cn\/player(#|\?.*)?$/.test(location.href)
        },
        getImageURLByFileName(fileName: string): string | null {
            return CreationProject1.widgetRequire("cp_utils")?.resToUrl.img(fileName) ?? null
        },
        getAudioURLByFileName(fileName: string): string | null {
            return CreationProject1.widgetRequire("cp_utils")?.resToUrl.audio(fileName) ?? null
        },
        getVideoURLByFileName(fileName: string): string | null {
            return CreationProject1.widgetRequire("cp_utils")?.resToUrl.video(fileName) ?? null
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
            }
        }
    }
}
