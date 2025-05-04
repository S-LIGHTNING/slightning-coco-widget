import type * as webpack from "webpack"

import { DevServerFixPlugin } from "./plugin/dev-server-fix-plugin"
import { WrapperPlugin } from "./plugin/wrapper-plugin"

export const config: webpack.Configuration = {
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
        new DevServerFixPlugin(),
        new WrapperPlugin()
    ]
}

export default config
