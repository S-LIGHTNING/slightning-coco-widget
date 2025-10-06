import browserEnv from "browser-env"

export default function (): void {
    browserEnv({
        url: "https://coco.codemao.cn/editor/"
    })
    Object.defineProperties(global, {
        alert: {
            value: function alert(message?: unknown): void {
                console.log(message)
            }
        },
        window: { value: window }
    })
}
