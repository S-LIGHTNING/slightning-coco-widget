const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const TerserPlugin = require("terser-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const SCW = require("slightning-coco-widget--webpack")
const package = require("./package.json")

/**
 * @returns {webpack.Configuration}
 */
module.exports = function (env, __argv) {
    /**
     * @type {webpack.Configuration["mode"]}
     */
    const mode = env.mode
    const comments = [
        "==CoCoWidget==",
        "@name " + "代码测试",
        "@author " + package.author,
        "@version " + package.version,
        "@license " + package.license,
        "==/CoCoWidget=="
    ]
    return merge(SCW.config, {
        mode,
        stats: "minimal",
        entry: "./src/index.ts",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: mode == "development" ? "代码测试.js" : `代码测试 v${package.version}.min.js`,
            environment: {
                arrowFunction: false
            },
            iife: false
        },
        devServer: {
            static: false,
            allowedHosts: [
                "coco.codemao.cn",
                "cp.cocotais.cn"
            ],
            headers(incomingMessage) {
                /** @type {{ rawHeaders: string[] }} */
                const {rawHeaders} = incomingMessage
                const origin = rawHeaders[rawHeaders.findIndex((value) => {
                    return /origin/i.test(value)
                }) + 1]
                return {
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "GET"
                }
            },
            hot: false,
            liveReload: false
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    include: /\.min\./,
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
        devtool: mode == "development" ? "eval-source-map" : false,
        module: {
            rules: [
                ...(mode == "development" ? [] : [{
                    test: /\.(t|j)sx?$/,
                    exclude: /node_modules/,
                    use: "babel-loader"
                }]), {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                }, {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    type: "asset/source",
                    use: mode == "development" ? [] : [{
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "autoprefixer",
                                    "postcss-preset-env"
                                ]
                            }
                        }
                    }]
                }
            ]
        },
        externalsType: "commonjs",
        externals: {
            lodash: "lodash"
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
