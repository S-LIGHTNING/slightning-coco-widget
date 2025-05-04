import styles from "./styles.module.css"

export default function Appreciation(): JSX.Element {
    return <section className={styles.appreciation}>
        <div className="container text--center">
            <p className={styles.appreciationText}>开发不易，给点赞助鼓励下吧！</p>
            <img
                className={styles.appreciationCode}
                src="https://s-lightning.github.io/res/SLIGHTNING/appreciation-code.png"
            />
        </div>
    </section>
}