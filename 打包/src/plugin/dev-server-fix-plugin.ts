import type * as webpack from "webpack"

export interface DevServerFixPluginOptions {
    test: RegExp
}

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
                            if (!originalSourceContent.includes("document.currentScript")) {
                                continue
                            }
                            const newSourceContent: string = [
                                "var __slightning_coco_widget_current_script__ = document.createElement(\"script\");",
                                "__slightning_coco_widget_current_script__.src = " + JSON.stringify(getAssetsURL(filename)) + ";",
                                originalSourceContent.replace(/document\.currentScript/g, "__slightning_coco_widget_current_script__")
                            ].join("\n")
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
