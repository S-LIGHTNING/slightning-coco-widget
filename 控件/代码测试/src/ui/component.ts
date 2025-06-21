export class Component {

    public readonly element: HTMLElement

    public constructor() {
        this.element = document.createElement("div")
    }

    public mount(this: this, element: HTMLElement): void {
        element.appendChild(this.element)
    }

    public remove(this: this): void {
        this.element.remove()
    }

    public clean(this: this): void {}

    public destroy(this: this): void {
        this.clean()
        this.remove()
    }
}
