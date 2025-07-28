import type * as webpack from "webpack"

import Loaders from "./loaders"
import { WrapperPlugin } from "./plugin/wrapper-plugin"

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
            }
        ]
    },
    externals: {
        react: "var React"
    },
    plugins: [
        new WrapperPlugin()
    ]
}

export default config
