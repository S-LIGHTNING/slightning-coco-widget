import type * as webpack from "webpack"

export interface DevServerFixPluginOptions {
    test: RegExp
}

interface Replace {
    inject: string
    search: RegExp
    replace: string
}

/**
 * @deprecated
 */
export class DevServerFixPlugin implements webpack.WebpackPluginInstance {

    public readonly options: DevServerFixPluginOptions

    public constructor(options?: Partial<DevServerFixPluginOptions> | null | undefined) {
        if (options == null) {
            options = {}
        }
        this.options = Object.assign({
            test: /(?<!\.hot-update)\.js$/
        }, options)
    }

    public apply(compiler: webpack.Compiler): void {
        const { webpack } = compiler
        if (compiler.options.devServer == undefined || compiler.options.devServer == false) {
            return
        }
        const devServerOptions: Record<string, any> = compiler.options.devServer

        function getAssetsURL(assetsName: string): string {
            const host: string = devServerOptions["host"] ?? "localhost"
            const port: string = devServerOptions["port"] || 8080
            const protocol: string = devServerOptions["https"] ? "https" : "http"
            const publicPath: string = devServerOptions["static"]?.publicPath ?? ""
            return `${protocol}://${host}:${port}${`/${publicPath}/${assetsName}`.replace(/\/+/g, "/")}`
        }

        compiler.hooks.compilation.tap(
            DevServerFixPlugin.name,
            (compilation: webpack.Compilation): void => {
                compilation.hooks.processAssets.tap(
                    {
                        name: DevServerFixPlugin.name,
                        stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                    },
                    (assets: typeof compilation.assets): void => {
                        for (const filename of Object.keys(assets)) {
                            if (!this.options.test.test(filename)) {
                                continue
                            }
                            const originalSource: webpack.sources.Source = compilation.assets[filename]!
                            const originalSourceContent: string = String(originalSource.source())
                            const assetsURL: string = getAssetsURL(filename)
                            const replaceArray: Replace[] = [
                                {
                                    inject: [
                                        "var __slightning_coco_widget_current_script__ = document.createElement(\"script\");",
                                        "__slightning_coco_widget_current_script__.src = " + JSON.stringify(assetsURL) + ";"
                                    ].join("\n"),
                                    search: /document\.currentScript/g,
                                    replace: "__slightning_coco_widget_current_script__"
                                }, {
                                    inject: [
                                        "async function __slightning_coco_widget_location_reload__() {",
                                        "  try {",
                                        "    if (location.hostname == \"coco.codemao.cn\" && location.pathname == \"/editor/\") {",
                                        "      var widgetInputElement = document.querySelector(\"div>span>input[type=file]\");",
                                        "      if (widgetInputElement == null || !(widgetInputElement instanceof HTMLInputElement)) {",
                                        "        throw new Error(\"找不到控件输入框\");",
                                        "      }",
                                        "      console.log(\"正在重新加载控件 " + filename + "……\");",
                                        "      var widgetContent = await (await fetch(" + JSON.stringify(assetsURL) + ")).text();",
                                        "      if (widgetContent == window[\"__slightning_coco_widget_content__\" + " + JSON.stringify(filename) + "]) {",
                                        "        console.log(\"控件 " + filename + " 内容未发生变化，无需重新加载\");",
                                        "        return;",
                                        "      }",
                                        "      window[\"__slightning_coco_widget_content__\" + " + JSON.stringify(filename) + "] = widgetContent;",
                                        "      var widgetBlob = new Blob([widgetContent], { type: \"text/javascript\" });",
                                        "      var widgetFile = new File([widgetBlob], " + JSON.stringify(filename) + ", { type: \"text/javascript\" });",
                                        "      var dataTransfer = new DataTransfer();",
                                        "      dataTransfer.items.add(widgetFile);",
                                        "      widgetInputElement.files = dataTransfer.files;",
                                        "      widgetInputElement.dispatchEvent(new Event(\"change\", { bubbles: true }));",
                                        "      setTimeout(function() {",
                                        "        replaceButton = document.querySelector(\"button.coco-button.coco-button-primary.coco-button-dangerous.coco-button-circle\");",
                                        "        if (replaceButton instanceof HTMLButtonElement) {",
                                        "          replaceButton.click();",
                                        "        }",
                                        "        console.log(\"控件 " + filename + " 重新加载成功\");",
                                        "      }, 150);",
                                        "    } else {",
                                        "      location.reload();",
                                        "    }",
                                        "  } catch (error) {",
                                        "    console.error(\"重新加载控件 " + filename + " 失败\", error);",
                                        "  }",
                                        "}"
                                    ].join("\n"),
                                    search: /(rootWindow|self)(\.location|\["location"\]|\[\\"location\\"\])\.reload/g,
                                    replace: "__slightning_coco_widget_location_reload__"
                                }
                            ]
                            let newSourceContent: string = originalSourceContent
                            for (const replace of replaceArray) {
                                if (replace.search.test(newSourceContent)) {
                                    newSourceContent = replace.inject + "\n" + newSourceContent.replace(replace.search, replace.replace)
                                }
                            }
                            let sourceMap: ReturnType<typeof originalSource.map> = originalSource.map()
                            if (sourceMap != null) {
                                assets[filename] = new webpack.sources.SourceMapSource(
                                    newSourceContent, filename, sourceMap
                                )
                            } else {
                                assets[filename] = new webpack.sources.OriginalSource(
                                    newSourceContent, filename
                                )
                            }
                        }
                    }
                )
            }
        )
    }
}
