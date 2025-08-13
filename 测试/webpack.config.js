// @ts-nocheck

const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const VisualizerPlugin2 = require("webpack-visualizer-plugin2")

const SCW = require("slightning-coco-widget--webpack")

module.exports = merge(SCW.config, {
    mode: "development",
    stats: "minimal",
    entry() {
        /** @type {Record<string, string>} */
        const entry = {}

        /**
         * @param {string} dirPathname
         * @returns {void}
         */
        function recursiveAddEntryFiles(dirPathname) {
            for (const fileName of fs.readdirSync(path.resolve(__dirname, "src", dirPathname))) {
                const filePathname = path.resolve(__dirname, "src", dirPathname, fileName)
                if (fs.lstatSync(filePathname).isDirectory()) {
                    recursiveAddEntryFiles(filePathname)
                } else if (/\.tsx?$/.test(fileName)) {
                    entry[filePathname.replace(path.resolve(__dirname, "src"), ".").replace(/(?<=\.)tsx?$/, "js")] = filePathname
                }
            }
        }

        recursiveAddEntryFiles(".")

        return entry
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
    devtool: "eval-source-map",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]",
        iife: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: SCW.Loaders.ExternalImportLoader,
                    options: {
                        axios: "https://unpkg.com/axios@1/dist/axios.min.js"
                    }
                }
            }, {
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
    externalsType: "commonjs",
    externals: {
        lodash: "lodash"
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new webpack.ProgressPlugin(),
        new webpack.IgnorePlugin({
            resourceRegExp: /webpack-dev-server/,
        }),
        new VisualizerPlugin2({
            filename: "./stats.html"
        })
    ],
    cache: false
})
