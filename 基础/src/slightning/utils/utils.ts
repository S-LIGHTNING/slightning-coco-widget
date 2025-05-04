import { getDefaultAdapter } from "../adapters/adapter"

export interface Utils {

    /**
     * 判断是否在 打包后的应用 上运行
     */
    inNative(): boolean

    /**
     * 判断是否是在编辑器中运行
     */
    inEditor(): boolean

    /**
     * 通过文件名获取素材库中对应文件的链接
     *
     * @param fileName 文件名
     *
     * @returns 素材库中对应文件的链接，如果对应文件不存在，则为 null
     */
    getImageURLByFileName(fileName: string): string | null

    /**
     * 通过文件名获取素材库中对应文件的链接
     *
     * @param fileName 文件名
     *
     * @returns 素材库中对应文件的链接，如果平台不支持该方法或对应文件不存在，则为 null
     */
    getAudioURLByFileName(fileName: string): string | null

    /**
     * 通过文件名获取素材库中对应文件的链接
     *
     * @param fileName 文件名
     *
     * @returns 素材库中对应文件的链接,如果平台不支持该方法或对应文件不存在，则为 null
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
