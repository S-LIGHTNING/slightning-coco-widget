import type * as monaco from "monaco-editor"
import styles from "./styles.module.css"
import { useEffect, useRef, useState } from "react"
import useBaseUrl from "@docusaurus/useBaseUrl"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function ExampleCode(props: { src: string }): JSX.Element {
    return <BrowserOnly>{(): JSX.Element => {
        const [monaco, setMonaco] = useState<typeof import("monaco-editor")>(null)
        import("monaco-editor").then(setMonaco)
        const elementRef: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>()
        const exampleCode: Promise<Response> = fetch(useBaseUrl(props.src))
        useEffect((): () => void => {
            if (monaco == null) {
                return
            }
            elementRef.current.innerHTML = ""
            const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(elementRef.current, {
                value: "Loading...",
                readOnly: true,
                language: "typescript",
                automaticLayout: true
            })
            ;(async (): Promise<void> => {
                editor.setValue(await (await exampleCode).text())
            })()
            return (): void => {
                editor.dispose()
            }
        }, [monaco, props.src])
        return (
            <div className={styles.bypassPlay} ref={elementRef}>Loading...</div>
        )
    }}</BrowserOnly>
}
