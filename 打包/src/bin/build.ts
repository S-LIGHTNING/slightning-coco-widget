#!/usr/bin/env node

import { spawn } from "child_process"
import { promises as fs } from "fs"
import path from "path"

import Loaders from "../loaders"
import environment from "../build-time-convert-environment"

environment()

const assetsPathFilepath = path.resolve(
    process.cwd(), "node_modules", ".slightning-coco-widget",
    "temp", "build-time-convert", "assets-path.json"
)

const originalAlert = alert
const originalConsole = console

async function main(): Promise<void> {
    const argv = process.argv.slice(2)
    let platform = "All"
    for (const testPlatform of ["CoCo", "CreationProject1", "CreationProject2"]) {
        if (argv[0]?.toLowerCase() == testPlatform.toLowerCase()) {
            platform = testPlatform
            argv.shift()
        }
    }
    global.__slightning_coco_widget_platform__ = platform
    await runWebpack(
        [...argv, "--mode", "none"],
        {
            __slightning_coco_widget_build_rime_convert_loader__: Loaders.BuildTimeConvertRecord,
            __slightning_coco_widget_platform__: platform,
            __slightning_coco_widget_assets_path_filepath__: assetsPathFilepath
        }
    )
    const assetsPath: string[] = await getAssetsPath()
    let count: number = 0
    for (const assetPath of assetsPath) {
        const code = String(await fs.readFile(assetPath))
        if (
            !code.includes("__slightning_coco_widget_write_record__") ||
            !code.includes("__slightning_coco_widget_with_record_context__")
        ) {
            continue
        }
        count++
        const widgetRelativePath = path.relative(process.cwd(), assetPath)
        Object.defineProperties(global, {
            alert: {
                value: function alert(message?: unknown): void {
                    console.log("[alert]", widgetRelativePath, message)
                }
            },
            console: {
                value: {
                    ...originalConsole,
                    log(...data: unknown[]): void {
                        originalConsole.log("[log]", widgetRelativePath, ...data)
                    },
                    info(...data: unknown[]): void {
                        originalConsole.info("[info]", widgetRelativePath, ...data)
                    },
                    debug(...data: unknown[]): void {
                        originalConsole.debug("[debug]", widgetRelativePath, ...data)
                    },
                    warn(...data: unknown[]): void {
                        originalConsole.warn("[warn]", widgetRelativePath, ...data)
                    },
                    error(...data: unknown[]): void {
                        originalConsole.error("[error]", widgetRelativePath, ...data)
                    }
                }
            }
        })
        class SuperWidget {
            public widgetLog() {}
            public widgetInfo() {}
            public widgetWarn() {}
            public widgetError() {}
        }
        try {
            new Function("require", "exports", "VisibleWidget", "InvisibleWidget", "widgetClass", "React", code)
            (require, exports, SuperWidget, SuperWidget, SuperWidget, { createElement(): void {} })
            new exports.widget({})
        } catch (error) {
            originalConsole.warn(`运行控件 ${widgetRelativePath} 失败：`, error)
        }
    }
    Object.defineProperties(global, {
        alert: { value: originalAlert },
        console: { value: originalConsole }
    })
    await runWebpack(argv, {
        __slightning_coco_widget_build_rime_convert_loader__: Loaders.BuildTimeConvertInject,
        __slightning_coco_widget_platform__: platform
    })
    await fs.rm(path.dirname(assetsPathFilepath), { recursive: true })
}

async function runWebpack(argv: string[], env?: Record<string, string> | null | undefined): Promise<void> {
    const child = spawn(process.execPath, [webpackCliPath, ...argv], {
        stdio: "inherit",
        env: { ...process.env, ...env }
    })
    await new Promise<void>((resolve, reject): void => {
        child.once("exit", (): void => { resolve() })
        child.once("error", (error): void => { reject(error) })
    })
}
const webpackCliPath: string = findWebpackCliPath()
function findWebpackCliPath(): string {
    try {
        return require.resolve("webpack-cli/bin/cli.js")
    } catch (error) {
        throw new Error("找不到 webpack-cli，请确保在当前项目中安装了 webpack-cli")
    }
}

async function getAssetsPath(): Promise<string[]> {
    try {
        return JSON.parse(String(await fs.readFile(assetsPathFilepath)))
    } catch (error) {
        if (error instanceof Error && "code" in error && error.code == "ENOENT") {
            console.log("获取输出文件失败，请检查是否添加了 SCW.BuildTimeConvertPlugin")
        }
        throw error
    }
}

main()
