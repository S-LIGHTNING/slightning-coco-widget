import type * as webpack from "webpack"

import Loaders from "./loaders"
import { WrapperPlugin } from "./plugin/wrapper"
import { BuildTimeConvertPlugin } from "./plugin/build-time-convert"

export const config: webpack.Configuration = {
    output: {
        library: {
            type: "commonjs"
        }
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: Loaders.BypassRestrictionsLoader,
            }, {
                test: /\.(j|t)sx?$/,
                use: Loaders.BuildTimeConvert
            }
        ]
    },
    externals: {
        react: "var React"
    },
    plugins: [
        new WrapperPlugin(),
        new BuildTimeConvertPlugin()
    ]
}

export default config
