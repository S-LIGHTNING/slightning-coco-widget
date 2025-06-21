import _ from "lodash"
import type * as monaco from "monaco-editor"
import styles from "./styles.module.css"
import { useEffect, useRef, useState } from "react"
import { bypassRestrictions } from "slightning-coco-widget--webpack"
import useBaseUrl from "@docusaurus/useBaseUrl"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function BypassRestrictionsPlay(): JSX.Element {
    return <BrowserOnly>{(): JSX.Element => {
        const [monaco, setMonaco] = useState<typeof import("monaco-editor")>(null)
        import("monaco-editor").then(setMonaco)
        const elementRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>()
        const exampleCode: Promise<Response> = fetch(useBaseUrl("/code/homepage/features/auto-bypass-restrictions/example.js"))
        useEffect((): () => void => {
            if (monaco == null) {
                return
            }
            elementRef.current.innerHTML = ""
            const editor: monaco.editor.IStandaloneDiffEditor = monaco.editor.createDiffEditor(elementRef.current, {
                diffCodeLens: true,
                originalEditable: true,
                readOnly: true,
                automaticLayout: true
            })
            const originalModel: monaco.editor.ITextModel = monaco.editor.createModel("Loading...","javascript")
            const modifiedModel: monaco.editor.ITextModel = monaco.editor.createModel("Loading...","javascript")
            editor.setModel({
                original: originalModel,
                modified: modifiedModel
            })
            ;(async (): Promise<void> => {
                originalModel.setValue(await (await exampleCode).text())
            })()
            originalModel.onDidChangeContent(_.debounce((): void => {
                try {
                    modifiedModel.setValue(bypassRestrictions(originalModel.getValue()))
                } catch (error) {
                    modifiedModel.setValue(error instanceof Error ? error.message + "\n" + error.stack : JSON.stringify(error))
                }
            }, 100))
            return (): void => {
                editor.dispose()
            }
        }, [monaco])
        return (
            <div className={styles.exampleCode} ref={elementRef}>Loading...</div>
        )
    }}</BrowserOnly>
}
