// @ts-nocheck

const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

const package = require("./package.json")

const SCW = require("slightning-coco-widget--webpack")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = function (env, argv) {
    const comments = [
        "==CoCoWidget==",
        "@name " + "控件实时重载",
        "@author " + package.author,
        "@version " + package.version,
        "@license " + package.license,
        "==/CoCoWidget=="
    ]
    /** @type {{ mode: webpack.Configuration["mode"] }} */
    const {mode} = env
    return merge(SCW.config, {
        mode,
        stats: "minimal",
        entry: "./src/widget-live-reload.ts",
        devServer: {
            static: {
                directory: path.join(__dirname, "dist")
            },
            allowedHosts: ["coco.codemao.cn"],
            headers: {
                "Access-Control-Allow-Origin": "https://coco.codemao.cn",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            devMiddleware: {
                publicPath: "/dist/"
            }
        },
        devtool: mode == "development" ? "eval-source-map" : false,
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: mode == "production" ? "控件实时重载.min.js" : "控件实时重载.js",
            iife: false
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    test: /\.min\.js$/,
                    terserOptions: {
                        format: {
                            // @ts-ignore
                            comments: new Function(
                                "node", "comment",
                                `return ${JSON.stringify(comments)}.some(item => comment.value.includes(item))`
                            )
                        }
                    },
                    extractComments: false
                })
            ]
        },
        module: {
            rules: [
                ...(mode == "production" ? [{
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: "babel-loader",
                }] : []), {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new webpack.ProgressPlugin(),
            new webpack.IgnorePlugin({
                resourceRegExp: /webpack-dev-server/,
            }),
            new webpack.BannerPlugin({
                banner: comments.map(line => `// ${line}\n`).join(""),
                raw: true,
                entryOnly: true
            })
        ]
    })
}
