import _ from "lodash"
import type * as monaco from "monaco-editor"
import styles from "./styles.module.css"
import { useEffect, useRef, useState } from "react"
import { bypassRestrictions } from "slightning-coco-widget--webpack"
import useBaseUrl from "@docusaurus/useBaseUrl"

export default function BypassRestrictionsPlay(): JSX.Element {
    const [monaco, setMonaco] = useState<typeof import("monaco-editor")>(null)
    useEffect((): void => {
        import("monaco-editor").then(setMonaco)
    }, [])
    const elementRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>()
    const [originalModel, setOriginalModel] = useState<monaco.editor.ITextModel>(null)
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
        const originalModel: monaco.editor.ITextModel = monaco.editor.createModel("正在加载代码……","javascript")
        setOriginalModel(originalModel)
        const modifiedModel: monaco.editor.ITextModel = monaco.editor.createModel("正在加载代码……","javascript")
        editor.setModel({
            original: originalModel,
            modified: modifiedModel
        })
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
    const absoluteSrc: string = useBaseUrl("/code/homepage/features/auto-bypass-restrictions/example.js")
    useEffect((): void => {
        if (originalModel == null) {
            return
        }
        ;(async (): Promise<void> => {
            originalModel.setValue(await (await fetch(absoluteSrc)).text())
        })()
    }, [originalModel, absoluteSrc])
    return (
        <div className={styles.exampleCode} ref={elementRef}>正在加载编辑器……</div>
    )
}
