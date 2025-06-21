import * as docusaurus from "@docusaurus/types"
import * as webpack from "webpack"
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin"

export default function (): docusaurus.Plugin {
    return {
        name: "docusaurus-webpack-config-plugin",
        configureWebpack(__config: webpack.Configuration, isServer: boolean,): webpack.Configuration {
            if (isServer) {
                return {
                    plugins: [
                        new webpack.IgnorePlugin({
                            resourceRegExp: /monaco-editor/
                        })
                    ]
                }
            }
            return {
                // @ts-ignore
                devServer: {
                    client: {
                        overlay: false
                    }
                },
                plugins: [
                    new webpack.DefinePlugin({
                        "process.env": "{}",
                        "process.env.BABEL_TYPES_8_BREAKING": "void 0"
                    }),
                    new MonacoWebpackPlugin()
                ]
            }
        }
    }
}
