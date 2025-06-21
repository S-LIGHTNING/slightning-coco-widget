import { TestGroup } from "../test-group"
import { Component } from "./component"
import style from "./style.css"
import { TestTable } from "./test-table"

export class TestWindow extends Component {

    public readonly head: TestWindowHead
    public readonly table: TestTable

    private showHandle: ReturnType<typeof setTimeout> | null = null
    private closeHandle: ReturnType<typeof setTimeout> | null = null

    public constructor(rootGroup: TestGroup) {
        super()
        this.element.classList.add("slightning--code-test-widget--window")
        this.head = new TestWindowHead(this)
        this.head.mount(this.element)
        const contentElement: HTMLElement = document.createElement("div")
        contentElement.classList.add("slightning--code-test-widget--window--content")
        this.table = new TestTable(rootGroup)
        this.table.mount(contentElement)
        this.element.appendChild(contentElement)
        const styleElement: HTMLStyleElement = document.createElement("style")
        styleElement.classList.add("slightning--code-test-widget--style")
        styleElement.innerHTML = style
        this.element.appendChild(styleElement)
    }

    public override mount(this: this, element: HTMLElement): void {
        this.element.classList.remove("slightning--code-test-widget--window--show")
        super.mount(element)
        if (this.closeHandle != null) {
            clearTimeout(this.closeHandle)
        }
        this.showHandle = setTimeout((): void => {
            this.element.classList.add("slightning--code-test-widget--window--show")
            this.showHandle = null
        }, 4)
    }

    public override clean(this: this): void {
        this.head.clean()
        this.table.clean()
        super.clean()
    }

    public override destroy(this: this): void {
        this.clean()
        this.element.classList.remove("slightning--code-test-widget--window--show")
        if (this.showHandle != null) {
            clearTimeout(this.showHandle)
        }
        this.closeHandle = setTimeout((): void => {
            this.remove()
        }, 200)
    }
}

export class TestWindowHead extends Component {

    public constructor(window: TestWindow) {
        super()
        this.element.classList.add("slightning--code-test-widget--window--head")
        const iconElement: HTMLImageElement = document.createElement("img")
        iconElement.src = "https://creation.bcmcdn.com/716/appcraft/IMAGE_GhCBzQGJq_1746362267120.svg"
        iconElement.classList.add("slightning--code-test-widget--window--head--icon")
        this.element.appendChild(iconElement)
        const titleElement: HTMLElement = document.createElement("div")
        titleElement.innerText = "代码测试"
        titleElement.classList.add("slightning--code-test-widget--window--head--title")
        this.element.appendChild(titleElement)
        const closeButton: HTMLElement = document.createElement("div")
        closeButton.classList.add("slightning--code-test-widget--window--head--close-button")
        closeButton.innerText = "×"
        closeButton.addEventListener("click", (): void => {
            window.destroy()
        })
        this.element.appendChild(closeButton)
    }
}
