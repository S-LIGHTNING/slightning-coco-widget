import { getDefaultAdapter } from "../adapters/adapter"

export interface Utils {

    /**
     * 判断是否在打包后的应用中。
     */
    inNative(): boolean

    /**
     * 判断是否是在编辑器中。
     */
    inEditor(): boolean

    /**
     * 判断是否在编辑器窗口中。
     */
    inEditorWindow(): boolean

    /**
     * 判断是否在编辑器运行器中。
     */
    inEditorPlayer(): boolean

    editor: {

        /**
         * 获取编辑器窗口，如果获取失败，则返回 null。
         */
        getWindow(): Window | null

        /**
         * 获取编辑器中当前打开的作品的名称，如果获取失败，则返回 null。
         */
        getWorkName(): string | null

        /**
         * 获取编辑器作品运行按钮。
         */
        getRunButton(): HTMLElement | null

        /**
         * 判断编辑器是有否运行作品。
         */
        isRunningWork(): boolean

        /**
         * 编辑器运行作品。
         */
        runWork(): void

        /**
         * 编辑器停止运行作品。
         */
        stopWork(): void

        /**
         * 编辑器保存作品。
         */
        saveWork(): Promise<void>

        /**
         * 在编辑器中重新打开当前打开的作品。
         */
        reopenWork(): void

        /**
         * 导入自定义控件。
         *
         * @param widget 自定义控件文件，可以是文件、Blob、或控件代码字符串。
         */
        importWidget(widget: File | Blob | string): void | Promise<void>
    }

    /**
     * 通过文件名获取素材库中对应文件的链接。
     *
     * @param fileName 文件名
     *
     * @returns 素材库中对应文件的链接，如果对应文件不存在，则为 null。
     */
    getImageURLByFileName(fileName: string): string | null

    /**
     * 通过文件名获取素材库中对应文件的链接。
     *
     * @param fileName 文件名
     *
     * @returns 素材库中对应文件的链接，如果平台不支持该方法或对应文件不存在，则为 null。
     */
    getAudioURLByFileName(fileName: string): string | null

    /**
     * 通过文件名获取素材库中对应文件的链接。
     *
     * @param fileName 文件名
     *
     * @returns 素材库中对应文件的链接,如果平台不支持该方法或对应文件不存在，则为 null。
     */
    getVideoURLByFileName(fileName: string): string | null
}

export const Utils: Utils = {
    inNative(): boolean {
        return getDefaultAdapter().utils.inNative()
    },
    inEditor(): boolean {
        return getDefaultAdapter().utils.inEditor()
    },
    inEditorWindow(): boolean {
        return getDefaultAdapter().utils.inEditorWindow()
    },
    inEditorPlayer(): boolean {
        return getDefaultAdapter().utils.inEditorPlayer()
    },
    editor: {
        getWindow(): Window | null {
            return getDefaultAdapter().utils.editor.getWindow()
        },
        getWorkName(): string | null {
            return getDefaultAdapter().utils.editor.getWorkName()
        },
        getRunButton(): HTMLElement | null {
            return getDefaultAdapter().utils.editor.getRunButton()
        },
        isRunningWork(): boolean {
            return getDefaultAdapter().utils.editor.isRunningWork()
        },
        runWork(): void {
            return getDefaultAdapter().utils.editor.runWork()
        },
        stopWork(): void {
            return getDefaultAdapter().utils.editor.stopWork()
        },
        saveWork(): Promise<void> {
            return getDefaultAdapter().utils.editor.saveWork()
        },
        reopenWork(): void {
            return getDefaultAdapter().utils.editor.reopenWork()
        },
        importWidget(widget: File | Blob | string): void | Promise<void> {
            return getDefaultAdapter().utils.editor.importWidget(widget)
        }
    },
    getImageURLByFileName(fileName: string): string | null {
        return getDefaultAdapter().utils.getImageURLByFileName(fileName)
    },
    getAudioURLByFileName(fileName: string): string | null {
        return getDefaultAdapter().utils.getAudioURLByFileName(fileName)
    },
    getVideoURLByFileName(fileName: string): string | null {
        return getDefaultAdapter().utils.getVideoURLByFileName(fileName)
    }
}
