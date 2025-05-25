import type * as webpack from "webpack"

import { WrapperPlugin } from "./plugin/wrapper-plugin"

export const config: webpack.Configuration = {
    output: {
        library: {
            type: "commonjs2"
        }
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: "slightning-coco-widget--webpack/loader/bypass-restrictions-loader",
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
