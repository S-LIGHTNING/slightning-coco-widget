import type * as webpack from "webpack"
import { promises as fs } from "fs"
import path from "path"
import Loaders from "../loaders"

const buildTimeConvertLoader = process.env["__slightning_coco_widget_build_rime_convert_loader__"]
const assetsPathFilepath = process.env["__slightning_coco_widget_assets_path_filepath__"]
if (typeof buildTimeConvertLoader == "string") {
    Loaders.BuildTimeConvert = buildTimeConvertLoader
}

export class BuildTimeConvertPlugin implements webpack.WebpackPluginInstance {
    public apply(compiler: webpack.Compiler): void {
        if (typeof assetsPathFilepath != "string") {
            return
        }
        compiler.hooks.done.tap("BuildTimeConvertPlugin", async (stats): Promise<void> => {
            const { compilation } = stats
            const assetsPath = []
            for (const name of Object.keys(compilation.assets)) {
                assetsPath.push(path.resolve(compilation.outputOptions.path ?? "dist", name))
            }
            await fs.mkdir(path.dirname(assetsPathFilepath), { recursive: true })
            await fs.writeFile(assetsPathFilepath, JSON.stringify(assetsPath))
        })
    }
}
