import type * as monaco from "monaco-editor"
import styles from "./styles.module.css"
import { useEffect, useMemo, useRef, useState } from "react"
import useBaseUrl from "@docusaurus/useBaseUrl"

export default function ExampleCode({ src }: { src: string }): JSX.Element {
    const [monaco, setMonaco] = useState<typeof import("monaco-editor")>(null)
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>(null)
    useEffect((): void => {
        import("monaco-editor").then(setMonaco)
    }, [])
    const elementRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>()
    useEffect((): () => void => {
        if (monaco == null) {
            return
        }
        elementRef.current.innerHTML = ""
        const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(elementRef.current, {
            value: "正在加载代码……",
            readOnly: true,
            language: "typescript",
            automaticLayout: true
        })
        setEditor(editor)
        return (): void => {
            editor.dispose()
        }
    }, [monaco, src])
    const absoluteSrc: string = useBaseUrl(src)
    useEffect((): void => {
        if (editor == null) {
            return
        }
        ;(async (): Promise<void> => {
            editor.setValue(await (await fetch(absoluteSrc)).text())
        })()
    }, [editor, absoluteSrc])
    return (
        <div className={styles.bypassPlay} ref={elementRef}>
            <noscript>你需要启用 JavaScript 才能打开代码编辑器</noscript>
            正在加载代码编辑器……
        </div>
    )
}
