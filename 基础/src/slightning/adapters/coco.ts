import * as CoCo from "../../coco"
import { Adapter } from "./adapter"
import type { crossPlatform } from "../runtime/cross-platform"

function isEditorWindow(window: Window): boolean {
    return /^https?:\/\/coco\.codemao\.cn\/editor\/((#|\?).*)?$/.test(window.location.href)
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
    return getEditorWindow()?.document.querySelector<HTMLInputElement>("input[placeholder=\"请输入作品名称\"]")?.value ?? null
}

function getEditorRunButton(): HTMLElement | null {
    return getEditorWindow()?.document.querySelector("[class^=\"style_playButton\"]") ?? null
}

function editorIsRunningWork(): boolean {
    return /[\s]*停[\s]*止[\s]*/.test(getEditorRunButton()?.textContent ?? "")
}

/**
 * @deprecated 适配器模式已弃用，请使用 {@link crossPlatform} 替代。
 */
export const CoCoAdapter: Adapter = {
    utils: {
        inNative(): boolean {
            return location.href == "file:///android_asset/www/index.html"
        },
        inEditor(): boolean {
            return /^https?:\/\/coco\.codemao\.cn\/editor\/(editor-player.html)?((#|\?).*)?$/.test(location.href)
        },
        inEditorWindow(): boolean {
            return isEditorWindow(window)
        },
        inEditorPlayer(): boolean {
            return /^https?:\/\/coco\.codemao\.cn\/editor\/editor-player.html((#|\?).*)?$/.test(location.href)
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
                return new Promise(
                    (resolve: () => void,
                    reject: (reason: Error) => void
                ): void => {
                    const editorWindow: Window | null = getEditorWindow()
                    if (editorWindow == null) {
                        reject(new Error("找不到编辑器窗口"))
                        return
                    }
                    const saveButton: Element | undefined = Array.from(editorWindow.document.querySelectorAll(".coco-button.coco-button-circle") ?? []).find(
                        (element: Element): boolean => element.querySelector("[class*=\"Header_saveText\"]") != null
                    )
                    if (!(saveButton instanceof HTMLElement)) {
                        reject(new Error("找不到保存按钮"))
                        return
                    }
                    saveButton.click()
                    const handle: ReturnType<typeof setInterval> = setInterval((): void => {
                        if (Array.from(saveButton.classList).some(
                            (className: string): boolean => className.startsWith("Header_saving")
                        )) {
                            return
                        }
                        clearInterval(handle)
                        resolve()
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
                const openButton: Element | undefined = Array.from(editorWindow.document.querySelectorAll(".coco-menu-item")).find(
                    (element: Element): boolean => element.children[0]?.textContent == "打开"
                )
                if (!(openButton instanceof HTMLElement)) {
                    throw new Error("找不到打开按钮")
                }
                openButton.click()
                const handle: ReturnType<typeof setInterval> = setInterval((): void => {
                    const worksElement: Element | null = editorWindow.document.querySelector("[class*=\"MyProject_main\"]")
                    if (!(worksElement instanceof HTMLElement)) {
                        return
                    }
                    clearInterval(handle)
                    const workNameElement: Element | undefined = Array.from(worksElement.querySelectorAll("[class*=\"MyProject_name\"]")).find(
                        (element: Element): boolean => element.textContent == workName
                    )
                    if (workNameElement == undefined) {
                        throw new Error("找不到作品")
                    }
                    workNameElement.parentElement?.click()
                    setTimeout((): void => {
                        const saveButton: Element | undefined = Array.from(editorWindow.document.querySelectorAll(".coco-button.coco-button-primary.coco-button-circle")).find(
                            (element: Element): boolean => element.textContent == "保存"
                        )
                        if (saveButton instanceof HTMLElement) {
                            saveButton.click()
                        }
                    }, 150)
                }, 100)
            },
            importWidget(widget: File | Blob | string): Promise<void> {
                return new Promise((
                    resolve: () => void,
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
                    const widgetInputLabelElement: Element | undefined = Array.from(
                        getEditorWindow()?.document?.querySelectorAll(".coco-upload-button-content") ?? []
                    ).find((element: Element): boolean => element.textContent == "导入自定义控件")
                    if (!(widgetInputLabelElement instanceof HTMLElement)) {
                        reject(new Error("找不到自定义控件导入按钮"))
                        return
                    }
                    const widgetInputElement: Element | null | undefined = widgetInputLabelElement.parentElement?.querySelector("input[type=file]")
                    if (!(widgetInputElement instanceof HTMLInputElement)) {
                        reject(new Error("找不到自定义控件导入按钮"))
                        return
                    }
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(widget)
                    widgetInputElement.files = dataTransfer.files
                    widgetInputElement.dispatchEvent(new Event("change", { bubbles: true }))
                    setTimeout((): void => {
                        const replaceButton: Element | null = document.querySelector(".coco-button.coco-button-primary.coco-button-dangerous.coco-button-circle")
                        if (replaceButton instanceof HTMLButtonElement && replaceButton.childNodes[0]?.textContent == "覆盖") {
                            replaceButton.click()
                        }
                        resolve()
                    }, 150)
                })
            }
        },
        getImageURLByFileName(fileName: string): string | null {
            return CoCo.widgetRequire("utils")?.getWidgetImageUrl(fileName) ?? null
        },
        getAudioURLByFileName(): string | null {
            return null
        },
        getVideoURLByFileName(): string | null {
            return null
        }
    }
}
