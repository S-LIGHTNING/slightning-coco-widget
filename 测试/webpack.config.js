const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const VisualizerPlugin2 = require("webpack-visualizer-plugin2")

const SCW = require("slightning-coco-widget--webpack")

module.exports = merge(/** @type {webpack.Configuration} */(SCW.config), {
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
                test: /\.(j|t)sx?$/,
                use: {
                    loader: SCW.Loaders.ExternalImportLoader,
                    options: {
                        "@slightning/anything-to-string": "https://unpkg.com/@slightning/anything-to-string@1/dist/cjs/bundle.min.js",
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
    optimization: {
        minimizer: []
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    externalsType: "commonjs",
    externals: {
        lodash: "lodash"
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.IgnorePlugin({
            resourceRegExp: /webpack-dev-server/,
        }),
        /** @type {webpack.WebpackPluginInstance} */(/** @type {unknown} */(
            new VisualizerPlugin2({ filename: "./stats.html" })
        ))
    ]
})
