// @ts-nocheck

const fs = require("fs")
const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const VisualizerPlugin2 = require("webpack-visualizer-plugin2")

const SCW = require("slightning-coco-widget--webpack")

// SCW.addExternalImport({
//     name: "axios",
//     source: "axios",
//     importer: SCW.importFromCoCo
// })

// SCW.addExternalImport({
//     name: "axios",
//     source: "https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js",
//     importer: SCW.importFromURL
// })

// SCW.addExternalImport({
//     name: "lodash",
//     source: "lodash",
//     importer: SCW.importFromCoCo
// })

module.exports = merge(SCW.config, {
    mode: "development",
    stats: "minimal",
    entry: () => {
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
                    entry[filePathname.replace(path.resolve(__dirname, "src"), ".").replace(/(?<=\.)t(?=sx?$)/, "j")] = filePathname
                }
            }
        }

        recursiveAddEntryFiles(".")

        return entry
    },
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
        client: {
            webSocketURL: "ws://localhost:8080/ws",
            overlay: false
        },
        hot: "only",
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
                exclude: /node_modules/,
                use: "babel-loader",
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
    externals: {
        axios: "axios"
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new webpack.ProgressPlugin(),
        new VisualizerPlugin2({
            filename: "./stats.html"
        })
    ]
})
