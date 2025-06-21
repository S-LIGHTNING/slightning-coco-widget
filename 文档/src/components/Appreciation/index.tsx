import Heading from "@theme/Heading"
import styles from "./styles.module.css"

export default function Appreciation(): JSX.Element {
    return <section className={styles.appreciation}>
        <div className="container text--center">
            <Heading as="h2">赞赏</Heading>
            <p className={styles.appreciationText}>开发不易，给点赞助鼓励下吧！</p>
            <img
                className={styles.appreciationCode}
                src="https://s-lightning.github.io/res/SLIGHTNING/appreciation-code.png"
            />
        </div>
    </section>
}