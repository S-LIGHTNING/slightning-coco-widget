import { useState } from "react"
import styles from "./styles.module.css"
import clsx from "clsx"

export default function Fullwindowable({
    className, children
}: {
    className?: string
    children?: JSX.Element | JSX.Element[]
}): JSX.Element {
    const [fullWindow, setFullWindow] = useState<boolean>(false)
    return (
        <div className={clsx(className, fullWindow ? styles.fullWindow : null)}>
            <div className={styles.toggleButtonWrapper}>
                <button
                    className={styles.toggleButton}
                    onClick={(): void => {
                        setFullWindow(!fullWindow)
                    }}
                >{fullWindow ? "缩小" : "放大"}</button>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    )
}
