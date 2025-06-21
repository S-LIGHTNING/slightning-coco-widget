import type * as webpack from "webpack"

import { bypassKeyWordsCheck } from "../bypass"

export const WrapperParamArray: string[] = [
    "require",
    "exports",
    "__slightning_coco_widget_require__",
    "__slightning_coco_widget_exports__",
    "InvisibleWidget",
    "VisibleWidget",
    "widgetClass",
    "React"
]

export const WrapperArgumentArray: string[] = [
    "require",
    "exports",
    "require",
    "exports",
    "typeof InvisibleWidget==\"undefined\"?void 0:InvisibleWidget",
    "typeof VisibleWidget==\"undefined\"?void 0:VisibleWidget",
    "typeof widgetClass==\"undefined\"?void 0:widgetClass",
    "React"
]

export interface WrapperPluginOptions {
    test: RegExp
    stringify: boolean
    catchError: boolean
}

export class WrapperPlugin implements webpack.WebpackPluginInstance {

    public readonly options: WrapperPluginOptions

    public constructor(options?: Partial<WrapperPluginOptions> | null | undefined) {
        if (options == null) {
            options = {}
        }
        this.options = Object.assign({
            test: /(?<!\.hot-update)\.js$/,
            stringify: false,
            catchError: true
        }, options)
    }

    public apply(compiler: webpack.Compiler): void {
        const { webpack } = compiler
        compiler.hooks.compilation.tap(
            WrapperPlugin.name,
            (compilation: webpack.Compilation): void => {
                compilation.hooks.processAssets.tap(
                    {
                        name: WrapperPlugin.name,
                        stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                    },
                    (assets: typeof compilation.assets): void => {
                        for (const filename of Object.keys(assets)) {
                            if (!this.options.test.test(filename)) {
                                continue
                            }
                            const originalSource: webpack.sources.Source = compilation.assets[filename]!
                            let sourceContent: string = String(originalSource.source())
                            if (this.options.catchError) {
                                sourceContent = `try{\n${sourceContent}}catch(e){\nif(e instanceof Error)alert(e.message);\nconsole.error(e);};\n`
                            }
                            if (this.options.stringify) {
                                sourceContent = `(new Function(${
                                    WrapperParamArray.map((name: string): string => JSON.stringify(name)).join(",")
                                }, // SLIGHTNING CoCo Widget Wrapper\n${
                                    bypassKeyWordsCheck(JSON.stringify(sourceContent)).replace(/;$/, "")
                                }))(${
                                    WrapperArgumentArray.join(",")
                                });\n`
                            } else {
                                sourceContent = `(new Function(${
                                    WrapperParamArray.map((name: string): string => JSON.stringify(name)).join(",")
                                },\"(\"+function () { // SLIGHTNING CoCo Widget Wrapper\n${
                                    bypassKeyWordsCheck(sourceContent)
                                }}.toString()+\")();\"))(${
                                    WrapperArgumentArray.join(",")
                                });\n`
                            }
                            let sourceMap: ReturnType<typeof originalSource.map> = originalSource.map()
                            if (sourceMap != null) {
                                assets[filename] = new webpack.sources.SourceMapSource(
                                    sourceContent, filename, sourceMap
                                )
                            } else {
                                assets[filename] = new webpack.sources.OriginalSource(
                                    sourceContent, filename
                                )
                            }
                        }
                    }
                )
            }
        )
    }
}
