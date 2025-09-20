// import type * as webpack from "webpack"
// import { transformAsync } from "@babel/core"
// import { ChildProcess, fork } from "child_process"
// import EventEmitter from "events"

// import { isMessage, Message } from "../build-time-convert-environment/message"

// class ConvertProcess extends EventEmitter {

//     public readonly childProcess: ChildProcess
//     public ready: boolean

//     public constructor() {
//         super()
//         this.childProcess = fork(import.meta.resolve("../compile-time-convert/child-process"))
//         this.ready = false
//         this.waitReadyMessage()
//     }

//     public async waitReady(): Promise<void> {
//         if (!this.ready) {
//             await this.waitReadyMessage()
//         }
//     }

//     private waitReadyMessage(): Promise<void> {
//         return new Promise((resolve: () => void): void => {
//             this.childProcess.once("message", (message): void => {
//                 if (isMessage(
//                     message,
//                     "__slightning_coco_widget_ready__",
//                     (data): data is undefined => data === undefined
//                 )) {
//                     this.ready = true
//                     resolve()
//                 }
//             })
//         })
//     }

//     public async execute(code: string): Promise<Record<PropertyKey, unknown>> {
//         await this.waitReady()
//         return new Promise((resolve, reject) => {
//             this.childProcess.send(
//                 {
//                     type: "__slightning_coco_widget_execute__",
//                     payload: code
//                 } satisfies Message<"__slightning_coco_widget_execute__", string>,
//                 (error): void => {
//                     if (error != null) {
//                         reject(error)
//                     }
//                 }
//             )
//             this.childProcess.once("message", (message): void => {
//                 if (isMessage(
//                     message,
//                     "__slightning_coco_widget_report_record__",
//                     (data): data is Record<PropertyKey, unknown> =>  data != null && typeof data === "object"
//                 )) {
//                     resolve(message.payload)
//                 }
//             })
//         })
//     }
// }

// let __convertProcess: ConvertProcess | null = null

// function getConvertProcess(): ConvertProcess {
//     return __convertProcess ?? (__convertProcess = new ConvertProcess())
// }

// export default function CompileTimeConvertLoader(
//     this: webpack.LoaderContext<{}>,
//     content: string
// ): undefined {
//     ;(async (): Promise<string> => {
//         const transformedCode: string = (await transformAsync(content, {
//             plugins: [
//                 "@babel/plugin-transform-modules-commonjs"
//             ],
//             configFile: false
//         }))?.code ?? ""
//         const convertProcess = getConvertProcess()
//         const record: Record<PropertyKey, unknown> = await convertProcess.execute(transformedCode)
//     })().then((result): void => {
//         this.callback(null, result)
//     }).catch((error): void => {
//         this.callback(error)
//     })
//     return undefined
// }
