import config from "./config"

export { config }

// import webpack = require("webpack")
// import { SLIGHTNINGCoCoWidgetPlugin } from "./plugin"
// import TerserPlugin = require("terser-webpack-plugin")


// export const minimizer: TerserPlugin[] = [
//     new TerserPlugin({
//         terserOptions: {
//             format: {
//                 comments: /This CoCo Widget uses SLIGHTNING CoCo Widget Framework\./
//             }
//         },
//         extractComments: false
//     })
// ]

// export const loaders: NonNullable<webpack.ModuleOptions["rules"]> = [
//     // TODO: 使用 loader 绕过关键词
//     // {
//     //     test: /\.(j|t)sx?$/,
//     //     use: "slightning-coco-widget--bypass-keywords-loader"
//     // }
// ]

// export const externalsType = "var"

// export const externals: Record<string, string> = {
//     react: "React"
// }

// export type ExternalImportLoaderOptions = {
//     [name: string]: {
//         source: any
//         importer: string
//     }
// }

// const externalImportLoaderOptions: ExternalImportLoaderOptions = {}

// loaders.push({
//     test: /\.(j|t)sx?$/,
//     use: {
//         loader: "slightning-coco-widget--webpack/external-import-loader",
//         options: externalImportLoaderOptions
//     }
// })

// const importerNameMap: Map<(source: any) => Promise<unknown>, string> = new Map()
// let importerNameCount: number = 0

// export type ExternalImportConfig<T> = {
//     name: string
//     preload?: boolean
//     source: T
//     importer?: (source: T) => Promise<unknown>
// }

// export function addExternalImport<T>(config: ExternalImportConfig<T>): void {
//     const { importer = importFromURL } = config
//     const { preload = importer == importFromCoCo } = config
//     let importerName: string
//     if (importerNameMap.has(importer)) {
//         importerName = importerNameMap.get(importer)!
//     } else {
//         importerName = `__slightning_coco_widget_external_import_${importerNameCount++}__`
//         importerNameMap.set(importer, importerName)
//         let importerString: string = importer.toString()
//         if (importer.name != "") {
//             importerString = importerString.replace(importer.name, "")
//         }
//         importerString = `var ${importerName} /* ${importer.name} */ = ${importerString};`
//         plugins.splice(-3, 0, new webpack.BannerPlugin({
//             banner: importerString,
//             raw: true,
//             entryOnly: true
//         }))
//     }
//     externalImportLoaderOptions[config.name] = {
//         source: config.source,
//         importer: importerName
//     }
//     if (preload) {
//         plugins.unshift(new webpack.BannerPlugin({
//             banner:
//                 `__slightning_coco_widget_external_import__(
//                     ${importerName}, ${JSON.stringify(config.name)}, ${JSON.stringify(config.source)}
//                 );`,
//             raw: true,
//             entryOnly: true
//         }))
//     }
// }

// export function importFromURL(source: string): Promise<unknown> {
//     return new Promise((resolve: (value: unknown) => void, reject: (reason: unknown) => void): void => {
//         var XHR: XMLHttpRequest = new XMLHttpRequest()
//         XHR.addEventListener("load", (): void => {
//             if (XHR.status != 200) {
//                 reject(new Error(`load error: GET ${source}: ${XHR.statusText}`))
//                 return
//             }
//             try {
//                 var code: string = XHR.responseText
//                 var exports: {} = {}, module: { exports: {} } = { exports: exports }
//                 new Function("module", "exports", code)(module, exports)
//                 resolve(module.exports)
//             } catch (error) {
//                 reject(error)
//             }
//         })
//         XHR.addEventListener("error", (): void => {
//             reject(new Error(`load error: GET ${source}`))
//         })
//         XHR.open("GET", source)
//         XHR.send()
//     })
// }

// declare function __slightning_coco_widget_require__(name: string): unknown | undefined

// export function importFromCoCo(source: string): Promise<unknown> {
//     return new Promise((resolve: (value: unknown) => void): void => {
//         resolve(__slightning_coco_widget_require__(source))
//     })
// }

// declare const __slightning_coco_widget_external_import_cache__: Record<string, Promise<unknown>>

// function __slightning_coco_widget_external_import__(
//     require: (source: unknown) => Promise<unknown>,
//     name: string,
//     source: unknown
// ): Promise<unknown> {
//     if (name in __slightning_coco_widget_external_import_cache__) {
//         return __slightning_coco_widget_external_import_cache__[String(name)]!
//     } else {
//         var result: Promise<unknown> = require(source)
//         __slightning_coco_widget_external_import_cache__[String(name)] = result
//         return result
//     }
// }

// function __slightning_coco_widget_get_global__(name: string): unknown {
//     return new Function("return window." + name.replace(/_/g, ""))()
// }

// declare global {
//     interface Window {
//         __slightning_coco_widget_web_socket__?: typeof window.WebSocket
//     }
// }

// function __W_e_b_S_o_c_k_e_t__(this: unknown,  url: string | URL, protocols?: string | string[]): WebSocket {
//     if (!(this instanceof __W_e_b_S_o_c_k_e_t__)) {
//         throw new TypeError("Cannot call a class as a function")
//     }
//     var window: typeof global.window = new Function("return window")()
//     var document = window.document
//     var location = window.location
//     if (window.__slightning_coco_widget_web_socket__ == undefined) {
//         var iFrameElement: HTMLIFrameElement = document.createElement("iframe")
//         iFrameElement.sandbox.add("allow-same-origin")
//         iFrameElement.src = location.href
//         document.body.appendChild(iFrameElement)
//         var contentWindow: typeof window = iFrameElement.contentWindow as typeof window
//         window.__slightning_coco_widget_web_socket__ = contentWindow[
//             "__W_e_b_S_o_c_k_e_t__".replace(/_/g, "") as "WebSocket"
//         ]
//     }
//     return new window.__slightning_coco_widget_web_socket__(url, protocols)
// }

// export const plugins: { apply(compiler: webpack.Compiler): void }[] = [
//     new webpack.BannerPlugin({
//         banner:
//             "var __slightning_coco_widget_external_import_cache__ = {};\n" +
//             __slightning_coco_widget_external_import__.toString(),
//         raw: true,
//         entryOnly: true
//     }),
//     new SLIGHTNINGCoCoWidgetPlugin(),
//     new webpack.BannerPlugin({
//         banner:
//             "/* This CoCo Widget uses SLIGHTNING CoCo Widget Framework. */\n\n" +
//             [
//                 __slightning_coco_widget_get_global__.toString(),
//                 "var __slightning_coco_widget_require__ = require;",
//                 "var __slightning_coco_widget_exports__ = exports;",
//                 ...[
//                     "__X_M_L_H_t_t_p_R_e_q_u_e_s_t__",
//                     "__X_M_L_H_t_t_p_R_e_q_u_e_s_t__Upload",
//                     "__X_M_L_H_t_t_p_R_e_q_u_e_s_t__EventTarget",
//                     "__f_e_t_c_h__",
//                     "__W_e_b_S_o_c_k_e_t__Error",
//                     "__W_e_b_S_o_c_k_e_t__Stream"
//                 ].map((name: string): string => {
//                     return `var ${name} = __slightning_coco_widget_get_global__("${name}");`
//                 }),
//                 `${__W_e_b_S_o_c_k_e_t__.toString()};`
//             ].join("\n") + "\n",
//         raw: true,
//         entryOnly: true
//     }),
//     new webpack.DefinePlugin({
//         "WebSocket": "__W_e_b_S_o_c_k_e_t__"
//     })
// ]
